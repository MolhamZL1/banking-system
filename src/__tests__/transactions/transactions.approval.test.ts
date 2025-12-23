import { TransactionsService } from "../../application/services/transactions.service";
import { AccountRepo } from "../../repositories/account.repo";
import { TransactionRepo } from "../../repositories/transaction.repo";
import { NotificationCenter } from "../../application/notifications/notification-center";
import prisma from "../../infrastructure/prisma/client";

describe("TransactionsService approvals", () => {
  function mkService() {
    const notifications = new NotificationCenter();
    jest.spyOn(notifications, "notify").mockResolvedValue(undefined as any);
    return new TransactionsService(new AccountRepo(), new TransactionRepo(), notifications);
  }

  test("approve: tx not found => 404", async () => {
    const s = mkService();
    (prisma as any).transaction.findUnique.mockResolvedValue(null);

    await expect(s.approve({ userId: 1, role: "ADMIN" }, 999))
      .rejects.toThrow("Transaction not found");
  });

  test("approve: tx not pending => 400", async () => {
    const s = mkService();
    (prisma as any).transaction.findUnique.mockResolvedValue({ id: 1, status: "COMPLETED", amount: 10 });

    await expect(s.approve({ userId: 1, role: "ADMIN" }, 1))
      .rejects.toThrow("Transaction is not pending");
  });

  test("approve: TELLER cannot approve >1000 => 403", async () => {
    const s = mkService();
    (prisma as any).transaction.findUnique.mockResolvedValue({ id: 1, status: "PENDING", amount: 5001 });

    await expect(s.approve({ userId: 2, role: "TELLER" }, 1))
      .rejects.toThrow("TELLER cannot approve this amount");
  });

  test("reject: marks FAILED + logs TX_REJECTED", async () => {
    const s = mkService();
    (prisma as any).transaction.findUnique.mockResolvedValue({
      id: 1, status: "PENDING", amount: 10, fromAccountId: null, toAccountId: 5
    });

    (prisma as any).transaction.update.mockResolvedValue({ id: 1 });
    (prisma as any).eventLog.create.mockResolvedValue({ id: 99 });

    const out = await s.reject({ userId: 2, role: "ADMIN" }, 1, "nope");
    expect(out.ok).toBe(true);

    expect((prisma as any).transaction.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 1 },
      data: expect.objectContaining({ status: "FAILED", approvedById: 2 }),
    }));

    expect((prisma as any).eventLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ eventType: "TX_REJECTED" }),
    }));
  });
});
