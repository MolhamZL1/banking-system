"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduledRunner = startScheduledRunner;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = __importDefault(require("../prisma/client"));
const transactions_service_1 = require("../../application/services/transactions.service");
const account_repo_1 = require("../../repositories/account.repo");
const transaction_repo_1 = require("../../repositories/transaction.repo");
const notification_wiring_1 = require("../../application/notifications/notification.wiring");
const txService = new transactions_service_1.TransactionsService(new account_repo_1.AccountRepo(), new transaction_repo_1.TransactionRepo(), (0, notification_wiring_1.buildNotificationCenter)());
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
function startScheduledRunner() {
    node_cron_1.default.schedule("* * * * *", async () => {
        const due = await client_1.default.scheduledTransaction.findMany({
            where: { isActive: true, nextRunAt: { lte: new Date() } },
        });
        for (const job of due) {
            try {
                await txService.create({
                    type: job.type,
                    amount: Number(job.amount),
                    fromAccountId: job.fromAccountId ?? undefined,
                    toAccountId: job.toAccountId ?? undefined,
                    requester: { userId: job.createdById, role: "CUSTOMER" },
                });
                await client_1.default.scheduledTransaction.update({
                    where: { id: job.id },
                    data: { nextRunAt: nextDate(job.frequency, job.nextRunAt) },
                });
            }
            catch (e) {
                await client_1.default.eventLog.create({
                    data: {
                        userId: job.createdById,
                        eventType: "SCHEDULED_TX_FAILED",
                        details: { scheduledId: job.id, error: String(e) },
                    },
                });
            }
        }
    });
}
