import cron from "node-cron";
import prisma from "../prisma/client";
import { TransactionsService } from "../../application/services/transactions.service";
import { AccountRepo } from "../../repositories/account.repo";
import { TransactionRepo } from "../../repositories/transaction.repo";
import { buildNotificationCenter } from "../../application/notifications/notification.wiring";

const txService = new TransactionsService(
  new AccountRepo(),
  new TransactionRepo(),
  buildNotificationCenter()
);

function nextDate(freq: "DAILY" | "WEEKLY" | "MONTHLY", from: Date) {
  const d = new Date(from);
  if (freq === "DAILY") d.setDate(d.getDate() + 1);
  if (freq === "WEEKLY") d.setDate(d.getDate() + 7);
  if (freq === "MONTHLY") d.setMonth(d.getMonth() + 1);
  return d;
}

export function startScheduledRunner() {
  cron.schedule("* * * * *", async () => {
    const due = await prisma.scheduledTransaction.findMany({
      where: { isActive: true, nextRunAt: { lte: new Date() } },
    });

    for (const job of due) {
      try {
        const result = await txService.create({
          type: job.type,
          amount: Number(job.amount),
          fromAccountId: job.fromAccountId ?? undefined,
          toAccountId: job.toAccountId ?? undefined,
          requester: { userId: job.createdById, role: "CUSTOMER" },
        });

      // لو ما فيه approval أصلاً (حسب منطقك: اعتبرها pending)
if (!result?.approval) {
  throw new Error("Scheduled transaction is pending approval");
}

// الآن approval موجودة
if (!result.approval.approved) {
  // هنا TypeScript صار يعرف إن هذا الفرع approved:false
  throw new Error(result.approval.reason ?? "Scheduled transaction is pending approval");
}


        await prisma.scheduledTransaction.update({
          where: { id: job.id },
          data: { nextRunAt: nextDate(job.frequency as any, job.nextRunAt) },
        });
      } catch (e) {
        await prisma.eventLog.create({
          data: {
            userId: job.createdById,
            eventType: "SCHEDULED_TX_FAILED",
            details: {
              scheduledId: job.id,
              error: e instanceof Error ? e.message : String(e),
            },
          },
        });
      }
    }
  });
}
