"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepo = void 0;
const client_1 = __importDefault(require("../infrastructure/prisma/client"));
class TransactionRepo {
    async atomicApplyAndMark(params) {
        return client_1.default.$transaction(async (tx) => {
            if (params.fromAccountId && params.fromNewBalance) {
                await tx.account.update({ where: { id: params.fromAccountId }, data: { balance: params.fromNewBalance } });
            }
            if (params.toAccountId && params.toNewBalance) {
                await tx.account.update({ where: { id: params.toAccountId }, data: { balance: params.toNewBalance } });
            }
            await tx.transaction.update({
                where: { id: params.txId },
                data: {
                    status: params.status,
                    approvedById: params.approvedById ?? null,
                },
            });
        });
    }
    pending() {
        return client_1.default.transaction.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "asc" },
        });
    }
}
exports.TransactionRepo = TransactionRepo;
