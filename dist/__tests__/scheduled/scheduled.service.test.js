"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scheduledTransactions_service_1 = require("../../application/services/scheduledTransactions.service");
const client_1 = __importDefault(require("../../infrastructure/prisma/client"));
describe("ScheduledTransactionsService", () => {
    test("create validates required account ids by type", async () => {
        const s = new scheduledTransactions_service_1.ScheduledTransactionsService();
        await expect(s.create({ userId: 1 }, {
            type: "TRANSFER",
            amount: 10,
            frequency: "DAILY",
            nextRunAt: new Date().toISOString(),
        })).rejects.toThrow();
    });
    test("create rejects scheduling for accounts not owned by user", async () => {
        const s = new scheduledTransactions_service_1.ScheduledTransactionsService();
        client_1.default.account.findMany.mockResolvedValue([{ id: 5, userId: 999 }]);
        await expect(s.create({ userId: 1 }, {
            type: "DEPOSIT",
            amount: 10,
            toAccountId: 5,
            frequency: "DAILY",
            nextRunAt: new Date().toISOString(),
        })).rejects.toThrow("You can only schedule for your own accounts");
    });
});
