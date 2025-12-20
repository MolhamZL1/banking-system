"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledTransactionsService = void 0;
const http_error_1 = require("../errors/http-error");
const scheduledTransaction_repo_1 = require("../../repositories/scheduledTransaction.repo");
const client_1 = __importDefault(require("../../infrastructure/prisma/client"));
function nextDate(freq, from) {
    const d = new Date(from);
    if (freq === "DAILY")
        d.setDate(d.getDate() + 1);
    if (freq === "WEEKLY")
        d.setDate(d.getDate() + 7);
    if (freq === "MONTHLY")
        d.setMonth(d.getMonth() + 1);
    return d;
}
class ScheduledTransactionsService {
    constructor(repo = new scheduledTransaction_repo_1.ScheduledTransactionRepo()) {
        this.repo = repo;
    }
    async create(requester, input) {
        if (input.amount <= 0)
            throw new http_error_1.HttpError(400, "Amount must be positive");
        if (input.type === "DEPOSIT" && !input.toAccountId)
            throw new http_error_1.HttpError(400, "toAccountId required");
        if (input.type === "WITHDRAWAL" && !input.fromAccountId)
            throw new http_error_1.HttpError(400, "fromAccountId required");
        if (input.type === "TRANSFER" && (!input.fromAccountId || !input.toAccountId))
            throw new http_error_1.HttpError(400, "fromAccountId and toAccountId required");
        // Ownership checks for customers (optional but important)
        const toCheck = [input.fromAccountId, input.toAccountId].filter(Boolean);
        const accounts = await client_1.default.account.findMany({ where: { id: { in: toCheck } }, select: { id: true, userId: true } });
        for (const a of accounts) {
            if (a.userId !== requester.userId)
                throw new http_error_1.HttpError(403, "You can only schedule for your own accounts");
        }
        const nextRun = new Date(input.nextRunAt);
        if (Number.isNaN(nextRun.getTime()))
            throw new http_error_1.HttpError(400, "Invalid nextRunAt");
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
    list(requester) {
        return this.repo.listByUser(requester.userId);
    }
    async stop(requester, id) {
        await this.repo.stop(requester.userId, id);
        return { ok: true };
    }
    async resume(requester, id) {
        await this.repo.resume(requester.userId, id);
        return { ok: true };
    }
    // helper for runner
    computeNextRun(freq, from) {
        return nextDate(freq, from);
    }
}
exports.ScheduledTransactionsService = ScheduledTransactionsService;
