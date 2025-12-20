"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledTransactionRepo = void 0;
const client_1 = __importDefault(require("../infrastructure/prisma/client"));
const client_2 = require("@prisma/client");
class ScheduledTransactionRepo {
    create(input) {
        const amountDec = new client_2.Prisma.Decimal(input.amount);
        return client_1.default.scheduledTransaction.create({
            data: {
                createdById: input.createdById,
                fromAccountId: input.fromAccountId ?? null,
                toAccountId: input.toAccountId ?? null,
                amount: amountDec,
                type: input.type,
                frequency: input.frequency,
                nextRunAt: input.nextRunAt,
            },
        });
    }
    listByUser(createdById) {
        return client_1.default.scheduledTransaction.findMany({
            where: { createdById },
            orderBy: { createdAt: "desc" },
        });
    }
    stop(createdById, id) {
        return client_1.default.scheduledTransaction.updateMany({
            where: { id, createdById },
            data: { isActive: false },
        });
    }
    resume(createdById, id) {
        return client_1.default.scheduledTransaction.updateMany({
            where: { id, createdById },
            data: { isActive: true },
        });
    }
    listDue() {
        return client_1.default.scheduledTransaction.findMany({
            where: { isActive: true, nextRunAt: { lte: new Date() } },
        });
    }
    updateNextRun(id, nextRunAt) {
        return client_1.default.scheduledTransaction.update({ where: { id }, data: { nextRunAt } });
    }
}
exports.ScheduledTransactionRepo = ScheduledTransactionRepo;
