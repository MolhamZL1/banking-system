"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepo = void 0;
const client_1 = __importDefault(require("../infrastructure/prisma/client"));
class NotificationRepo {
    async create(data) {
        return client_1.default.notification.create({
            data: {
                userId: data.userId,
                relatedAccountId: data.relatedAccountId,
                relatedTransactionId: data.relatedTransactionId,
                channel: data.channel,
                message: data.message,
                status: data.status ?? "PENDING",
            },
        });
    }
    async listByUser(userId, take = 50) {
        return client_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take,
        });
    }
    async markRead(userId, id) {
        return client_1.default.notification.updateMany({
            where: { id, userId, readAt: null },
            data: { readAt: new Date() },
        });
    }
}
exports.NotificationRepo = NotificationRepo;
