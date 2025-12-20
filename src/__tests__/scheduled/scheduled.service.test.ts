import { ScheduledTransactionsService } from "../../application/services/scheduledTransactions.service";
import prisma from "../../infrastructure/prisma/client";

describe("ScheduledTransactionsService", () => {
  test("create validates required account ids by type", async () => {
    const s = new ScheduledTransactionsService();
    await expect(s.create({ userId: 1 }, {
      type: "TRANSFER" as any,
      amount: 10,
      frequency: "DAILY" as any,
      nextRunAt: new Date().toISOString(),
    } as any)).rejects.toThrow();
  });

  test("create rejects scheduling for accounts not owned by user", async () => {
    const s = new ScheduledTransactionsService();
    (prisma as any).account.findMany.mockResolvedValue([{ id: 5, userId: 999 }]);

    await expect(s.create({ userId: 1 }, {
      type: "DEPOSIT" as any,
      amount: 10,
      toAccountId: 5,
      frequency: "DAILY" as any,
      nextRunAt: new Date().toISOString(),
    })).rejects.toThrow("You can only schedule for your own accounts");
  });
});
