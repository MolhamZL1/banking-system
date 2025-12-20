"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_service_1 = require("../../application/services/transactions.service");
const account_repo_1 = require("../../repositories/account.repo");
const transaction_repo_1 = require("../../repositories/transaction.repo");
const notification_center_1 = require("../../application/notifications/notification-center");
const ActiveState_1 = require("../../domain/accounts/state/ActiveState");
const CheckingAccount_1 = require("../../domain/accounts/composite/CheckingAccount");
const client_1 = __importDefault(require("../../infrastructure/prisma/client"));
describe("TransactionsService", () => {
    function mkService() {
        const accounts = new account_repo_1.AccountRepo();
        const txRepo = new transaction_repo_1.TransactionRepo();
        const notifications = new notification_center_1.NotificationCenter();
        jest.spyOn(notifications, "notify").mockResolvedValue(undefined);
        return { service: new transactions_service_1.TransactionsService(accounts, txRepo, notifications) };
    }
    test("AUTO approve small deposit => COMPLETED + event TX_COMPLETED", async () => {
        const { service } = mkService();
        const toAcc = new CheckingAccount_1.CheckingAccount("10", "to", 0, 0, new ActiveState_1.ActiveState());
        jest.spyOn(account_repo_1.AccountRepo.prototype, "findByIdDecorated").mockResolvedValue(toAcc);
        client_1.default.transaction.create.mockResolvedValue({
            id: 1, amount: 50, type: "DEPOSIT", status: "COMPLETED", fromAccountId: null, toAccountId: 10
        });
        jest.spyOn(transaction_repo_1.TransactionRepo.prototype, "atomicApplyAndMark").mockResolvedValue(undefined);
        client_1.default.eventLog.create.mockResolvedValue({ id: 99 });
        const out = await service.create({
            type: "DEPOSIT",
            amount: 50,
            toAccountId: 10,
            requester: { userId: 7, role: "CUSTOMER" },
        });
        expect(out.approval.approved).toBe(true);
        expect(client_1.default.eventLog.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ eventType: "TX_COMPLETED" }),
        }));
    });
    test("Large deposit by CUSTOMER => PENDING + event TX_PENDING", async () => {
        const { service } = mkService();
        client_1.default.transaction.create.mockResolvedValue({
            id: 2, amount: 5000, type: "DEPOSIT", status: "PENDING", fromAccountId: null, toAccountId: 10
        });
        client_1.default.eventLog.create.mockResolvedValue({ id: 100 });
        const out = await service.create({
            type: "DEPOSIT",
            amount: 5000,
            toAccountId: 10,
            requester: { userId: 7, role: "CUSTOMER" },
        });
        expect(out.approval.approved).toBe(false);
        expect(client_1.default.eventLog.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ eventType: "TX_PENDING" }),
        }));
    });
});
