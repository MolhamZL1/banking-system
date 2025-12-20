import { Prisma, TransactionType } from "@prisma/client";
import prisma from "../../infrastructure/prisma/client";
import { HttpError } from "../errors/http-error";
import { AccountRepo } from "../../repositories/account.repo";
import { TransactionRepo } from "../../repositories/transaction.repo";
import { NotificationCenter } from "../notifications/notification-center";

import { AutoApprove } from "../../domain/transactions/approval/AutoApprove";
import { TellerApprove } from "../../domain/transactions/approval/TellerApprove";
import { ManagerApprove } from "../../domain/transactions/approval/ManagerApprove";

export class TransactionsService {
  constructor(
    private readonly accounts: AccountRepo,
    private readonly txRepo: TransactionRepo,
    private readonly notifications: NotificationCenter
  ) {}

  private chain() {
    const c = new AutoApprove(100);
    c.setNext(new TellerApprove(1000)).setNext(new ManagerApprove());
    return c;
  }

  async create(input: {
    type: TransactionType;
    amount: number;
    fromAccountId?: number;
    toAccountId?: number;
    requester: { userId: number; role: string };
  }) {
    if (input.amount <= 0) throw new HttpError(400, "Amount must be positive");

    if (input.type === "DEPOSIT" && !input.toAccountId) throw new HttpError(400, "toAccountId required");
    if (input.type === "WITHDRAWAL" && !input.fromAccountId) throw new HttpError(400, "fromAccountId required");
    if (input.type === "TRANSFER" && (!input.fromAccountId || !input.toAccountId))
      throw new HttpError(400, "fromAccountId and toAccountId required");

    const decision = this.chain().handle({
      type: input.type,
      amount: input.amount,
      requestedByRole: input.requester.role,
    });

    const amountDec = new Prisma.Decimal(input.amount);

    const txRecord = await prisma.transaction.create({
      data: {
        type: input.type,
        amount: amountDec,
        status: decision.approved ? "COMPLETED" : "PENDING",
        fromAccountId: input.fromAccountId,
        toAccountId: input.toAccountId,
        approvedById: decision.approved && decision.level !== "AUTO" ? input.requester.userId : null,
      },
    });

    if (!decision.approved) {
      await prisma.eventLog.create({
        data: {
          userId: input.requester.userId,
          accountId: input.fromAccountId ?? input.toAccountId ?? null,
          transactionId: txRecord.id,
          eventType: "TX_PENDING",
          details: { decision },
        },
      });
      return { tx: txRecord, approval: decision };
    }

    await this.applyBalancesAndLog({
      txId: txRecord.id,
      type: input.type,
      amount: input.amount,
      fromAccountId: input.fromAccountId,
      toAccountId: input.toAccountId,
      approvedById: decision.level !== "AUTO" ? input.requester.userId : null,
      actorUserId: input.requester.userId,
      decision,
    });

    return { tx: { ...txRecord, status: "COMPLETED" }, approval: decision };
  }

  async pending(requester: { role: string }) {
    const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
    if (!staff) throw new HttpError(403, "Forbidden");
    return this.txRepo.pending();
  }

  async approve(requester: { userId: number; role: string }, txId: number) {
    const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
    if (!staff) throw new HttpError(403, "Forbidden");

    const tx = await prisma.transaction.findUnique({ where: { id: txId } });
    if (!tx) throw new HttpError(404, "Transaction not found");
    if (tx.status !== "PENDING") throw new HttpError(400, "Transaction is not pending");

    // manager/admin can approve any amount; teller should not approve huge ones (optional rule)
    if (requester.role === "TELLER" && Number(tx.amount) > 1000) {
      throw new HttpError(403, "TELLER cannot approve this amount");
    }

    await this.applyBalancesAndLog({
      txId: tx.id,
      type: tx.type,
      amount: Number(tx.amount),
      fromAccountId: tx.fromAccountId ?? undefined,
      toAccountId: tx.toAccountId ?? undefined,
      approvedById: requester.userId,
      actorUserId: requester.userId,
      decision: { approved: true, level: requester.role === "TELLER" ? "TELLER" : "MANAGER" },
    });

    return { ok: true };
  }

  async reject(requester: { userId: number; role: string }, txId: number, reason?: string) {
    const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
    if (!staff) throw new HttpError(403, "Forbidden");

    const tx = await prisma.transaction.findUnique({ where: { id: txId } });
    if (!tx) throw new HttpError(404, "Transaction not found");
    if (tx.status !== "PENDING") throw new HttpError(400, "Transaction is not pending");

    await prisma.transaction.update({
      where: { id: txId },
      data: { status: "FAILED", approvedById: requester.userId },
    });

    await prisma.eventLog.create({
      data: {
        userId: requester.userId,
        accountId: tx.fromAccountId ?? tx.toAccountId ?? null,
        transactionId: tx.id,
        eventType: "TX_REJECTED",
        details: { reason: reason ?? "rejected" },
      },
    });

    return { ok: true };
  }

  private async applyBalancesAndLog(args: {
    txId: number;
    type: TransactionType;
    amount: number;
    fromAccountId?: number;
    toAccountId?: number;
    approvedById: number | null;
    actorUserId: number;
    decision: any;
  }) {
    const amount = args.amount;

    let fromNew: Prisma.Decimal | undefined;
    let toNew: Prisma.Decimal | undefined;

    if (args.type === "DEPOSIT") {
      const toAcc = await this.accounts.findByIdDecorated(args.toAccountId!);
      if (!toAcc) throw new HttpError(404, "Account not found");
      toAcc.deposit(amount);
      toNew = new Prisma.Decimal(toAcc.getBalance());
    }

    if (args.type === "WITHDRAWAL") {
      const fromAcc = await this.accounts.findByIdDecorated(args.fromAccountId!);
      if (!fromAcc) throw new HttpError(404, "Account not found");
      fromAcc.withdraw(amount);
      fromNew = new Prisma.Decimal(fromAcc.getBalance());
    }

    if (args.type === "TRANSFER") {
      const fromAcc = await this.accounts.findByIdDecorated(args.fromAccountId!);
      const toAcc = await this.accounts.findByIdDecorated(args.toAccountId!);
      if (!fromAcc || !toAcc) throw new HttpError(404, "Account not found");

      fromAcc.withdraw(amount);
      toAcc.deposit(amount);

      fromNew = new Prisma.Decimal(fromAcc.getBalance());
      toNew = new Prisma.Decimal(toAcc.getBalance());
    }

    await this.txRepo.atomicApplyAndMark({
      txId: args.txId,
      status: "COMPLETED",
      approvedById: args.approvedById,
      fromAccountId: args.fromAccountId,
      toAccountId: args.toAccountId,
      fromNewBalance: fromNew,
      toNewBalance: toNew,
    });

    await prisma.eventLog.create({
      data: {
        userId: args.actorUserId,
        accountId: args.fromAccountId ?? args.toAccountId ?? null,
        transactionId: args.txId,
        eventType: "TX_COMPLETED",
        details: { decision: args.decision },
      },
    });

    await this.notifications.notify({
      type: "ACCOUNT_STATE_CHANGED" as any,
      at: new Date(),
      userId: args.actorUserId,
      accountId: (args.fromAccountId ?? args.toAccountId) as number,
      accountName: undefined,
      message: `Transaction completed: ${args.type} amount=${amount}`,
    } as any);
  }
}
