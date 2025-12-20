"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepo = void 0;
const client_1 = __importDefault(require("../infrastructure/prisma/client"));
class EventRepo {
    listForUser(userId, take = 100) {
        return client_1.default.eventLog.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take,
        });
    }
    listAll(filters, take = 200) {
        return client_1.default.eventLog.findMany({
            where: { ...(filters?.userId ? { userId: filters.userId } : {}) },
            orderBy: { createdAt: "desc" },
            take,
        });
    }
}
exports.EventRepo = EventRepo;
