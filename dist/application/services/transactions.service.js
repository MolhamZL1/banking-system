"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const client_1 = require("@prisma/client");
const client_2 = __importDefault(require("../../infrastructure/prisma/client"));
const http_error_1 = require("../errors/http-error");
const AutoApprove_1 = require("../../domain/transactions/approval/AutoApprove");
const TellerApprove_1 = require("../../domain/transactions/approval/TellerApprove");
const ManagerApprove_1 = require("../../domain/transactions/approval/ManagerApprove");
class TransactionsService {
    constructor(accounts, txRepo, notifications) {
        this.accounts = accounts;
        this.txRepo = txRepo;
        this.notifications = notifications;
    }
    chain() {
        const c = new AutoApprove_1.AutoApprove(100);
        c.setNext(new TellerApprove_1.TellerApprove(1000)).setNext(new ManagerApprove_1.ManagerApprove());
        return c;
    }
    async create(input) {
        if (input.amount <= 0)
            throw new http_error_1.HttpError(400, "Amount must be positive");
        if (input.type === "DEPOSIT" && !input.toAccountId)
            throw new http_error_1.HttpError(400, "toAccountId required");
        if (input.type === "WITHDRAWAL" && !input.fromAccountId)
            throw new http_error_1.HttpError(400, "fromAccountId required");
        if (input.type === "TRANSFER" && (!input.fromAccountId || !input.toAccountId))
            throw new http_error_1.HttpError(400, "fromAccountId and toAccountId required");
        const decision = this.chain().handle({
            type: input.type,
            amount: input.amount,
            requestedByRole: input.requester.role,
        });
        const amountDec = new client_1.Prisma.Decimal(input.amount);
        const txRecord = await client_2.default.transaction.create({
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
            await client_2.default.eventLog.create({
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
    async pending(requester) {
        const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
        if (!staff)
            throw new http_error_1.HttpError(403, "Forbidden");
        return this.txRepo.pending();
    }
    async approve(requester, txId) {
        const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
        if (!staff)
            throw new http_error_1.HttpError(403, "Forbidden");
        const tx = await client_2.default.transaction.findUnique({ where: { id: txId } });
        if (!tx)
            throw new http_error_1.HttpError(404, "Transaction not found");
        if (tx.status !== "PENDING")
            throw new http_error_1.HttpError(400, "Transaction is not pending");
        // manager/admin can approve any amount; teller should not approve huge ones (optional rule)
        if (requester.role === "TELLER" && Number(tx.amount) > 1000) {
            throw new http_error_1.HttpError(403, "TELLER cannot approve this amount");
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
    async reject(requester, txId, reason) {
        const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
        if (!staff)
            throw new http_error_1.HttpError(403, "Forbidden");
        const tx = await client_2.default.transaction.findUnique({ where: { id: txId } });
        if (!tx)
            throw new http_error_1.HttpError(404, "Transaction not found");
        if (tx.status !== "PENDING")
            throw new http_error_1.HttpError(400, "Transaction is not pending");
        await client_2.default.transaction.update({
            where: { id: txId },
            data: { status: "FAILED", approvedById: requester.userId },
        });
        await client_2.default.eventLog.create({
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
    async applyBalancesAndLog(args) {
        const amount = args.amount;
        let fromNew;
        let toNew;
        if (args.type === "DEPOSIT") {
            const toAcc = await this.accounts.findByIdDecorated(args.toAccountId);
            if (!toAcc)
                throw new http_error_1.HttpError(404, "Account not found");
            toAcc.deposit(amount);
            toNew = new client_1.Prisma.Decimal(toAcc.getBalance());
        }
        if (args.type === "WITHDRAWAL") {
            const fromAcc = await this.accounts.findByIdDecorated(args.fromAccountId);
            if (!fromAcc)
                throw new http_error_1.HttpError(404, "Account not found");
            fromAcc.withdraw(amount);
            fromNew = new client_1.Prisma.Decimal(fromAcc.getBalance());
        }
        if (args.type === "TRANSFER") {
            const fromAcc = await this.accounts.findByIdDecorated(args.fromAccountId);
            const toAcc = await this.accounts.findByIdDecorated(args.toAccountId);
            if (!fromAcc || !toAcc)
                throw new http_error_1.HttpError(404, "Account not found");
            fromAcc.withdraw(amount);
            toAcc.deposit(amount);
            fromNew = new client_1.Prisma.Decimal(fromAcc.getBalance());
            toNew = new client_1.Prisma.Decimal(toAcc.getBalance());
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
        await client_2.default.eventLog.create({
            data: {
                userId: args.actorUserId,
                accountId: args.fromAccountId ?? args.toAccountId ?? null,
                transactionId: args.txId,
                eventType: "TX_COMPLETED",
                details: { decision: args.decision },
            },
        });
        await this.notifications.notify({
            type: "ACCOUNT_STATE_CHANGED",
            at: new Date(),
            userId: args.actorUserId,
            accountId: (args.fromAccountId ?? args.toAccountId),
            accountName: undefined,
            message: `Transaction completed: ${args.type} amount=${amount}`,
        });
    }
}
exports.TransactionsService = TransactionsService;
