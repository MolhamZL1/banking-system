import { Frequency, TransactionType } from "@prisma/client";
import { HttpError } from "../errors/http-error";
import { ScheduledTransactionRepo } from "../../repositories/scheduledTransaction.repo";
import prisma from "../../infrastructure/prisma/client";

function nextDate(freq: Frequency, from: Date) {
  const d = new Date(from);
  if (freq === "DAILY") d.setDate(d.getDate() + 1);
  if (freq === "WEEKLY") d.setDate(d.getDate() + 7);
  if (freq === "MONTHLY") d.setMonth(d.getMonth() + 1);
  return d;
}

export class ScheduledTransactionsService {
  constructor(private readonly repo = new ScheduledTransactionRepo()) {}

  async create(requester: { userId: number }, input: {
    type: TransactionType;
    amount: number;
    fromAccountId?: number;
    toAccountId?: number;
    frequency: Frequency;
    nextRunAt: string;
  }) {
    if (input.amount <= 0) throw new HttpError(400, "Amount must be positive");

    if (input.type === "DEPOSIT" && !input.toAccountId) throw new HttpError(400, "toAccountId required");
    if (input.type === "WITHDRAWAL" && !input.fromAccountId) throw new HttpError(400, "fromAccountId required");
    if (input.type === "TRANSFER" && (!input.fromAccountId || !input.toAccountId))
      throw new HttpError(400, "fromAccountId and toAccountId required");

    // Ownership checks for customers (optional but important)
    const toCheck = [input.fromAccountId, input.toAccountId].filter(Boolean) as number[];
    const accounts = await prisma.account.findMany({ where: { id: { in: toCheck } }, select: { id: true, userId: true } });
    for (const a of accounts) {
      if (a.userId !== requester.userId) throw new HttpError(403, "You can only schedule for your own accounts");
    }

    const nextRun = new Date(input.nextRunAt);
    if (Number.isNaN(nextRun.getTime())) throw new HttpError(400, "Invalid nextRunAt");

    return this.repo.create({
      createdById: requester.userId,
      fromAccountId: input.fromAccountId,
      toAccountId: input.toAccountId,
      amount: input.amount,
      type: input.type,
      frequency: input.frequency,
      nextRunAt: nextRun,
    });
  }

  list(requester: { userId: number }) {
    return this.repo.listByUser(requester.userId);
  }

  async stop(requester: { userId: number }, id: number) {
    await this.repo.stop(requester.userId, id);
    return { ok: true };
  }

  async resume(requester: { userId: number }, id: number) {
    await this.repo.resume(requester.userId, id);
    return { ok: true };
  }

  // helper for runner
  computeNextRun(freq: Frequency, from: Date) {
    return nextDate(freq, from);
  }
}
