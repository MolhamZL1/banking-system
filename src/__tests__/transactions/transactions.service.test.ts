import { TransactionsService } from "../../application/services/transactions.service";
import { AccountRepo } from "../../repositories/account.repo";
import { TransactionRepo } from "../../repositories/transaction.repo";
import { NotificationCenter } from "../../application/notifications/notification-center";
import { ActiveState } from "../../domain/accounts/state/ActiveState";
import { CheckingAccount } from "../../domain/accounts/composite/CheckingAccount";
import prisma from "../../infrastructure/prisma/client";

describe("TransactionsService", () => {
  function mkService() {
    const accounts = new AccountRepo();
    const txRepo = new TransactionRepo();
    const notifications = new NotificationCenter();
    jest.spyOn(notifications, "notify").mockResolvedValue(undefined as any);
    return { service: new TransactionsService(accounts, txRepo, notifications) };
  }

  test("AUTO approve small deposit => COMPLETED + event TX_COMPLETED", async () => {
    const { service } = mkService();

    const toAcc = new CheckingAccount("10", "to", 0, 0, new ActiveState());
    jest.spyOn(AccountRepo.prototype, "findByIdDecorated").mockResolvedValue(toAcc as any);

    (prisma as any).transaction.create.mockResolvedValue({
      id: 1, amount: 50, type: "DEPOSIT", status: "COMPLETED", fromAccountId: null, toAccountId: 10
    });

    jest.spyOn(TransactionRepo.prototype, "atomicApplyAndMark").mockResolvedValue(undefined as any);
    (prisma as any).eventLog.create.mockResolvedValue({ id: 99 });

    const out = await service.create({
      type: "DEPOSIT" as any,
      amount: 50,
      toAccountId: 10,
      requester: { userId: 7, role: "CUSTOMER" },
    });

    expect(out.approval.approved).toBe(true);
    expect((prisma as any).eventLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ eventType: "TX_COMPLETED" }),
    }));
  });

  test("Large deposit by CUSTOMER => PENDING + event TX_PENDING", async () => {
    const { service } = mkService();

    (prisma as any).transaction.create.mockResolvedValue({
      id: 2, amount: 5000, type: "DEPOSIT", status: "PENDING", fromAccountId: null, toAccountId: 10
    });

    (prisma as any).eventLog.create.mockResolvedValue({ id: 100 });

    const out = await service.create({
      type: "DEPOSIT" as any,
      amount: 5000,
      toAccountId: 10,
      requester: { userId: 7, role: "CUSTOMER" },
    });

    expect(out.approval.approved).toBe(false);
    expect((prisma as any).eventLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ eventType: "TX_PENDING" }),
    }));
  });
});
