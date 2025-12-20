import prisma from "../infrastructure/prisma/client";
import { Prisma } from "@prisma/client";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export class AdminRepo {
  async dashboard() {
    const now = new Date();

    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(now);
    monthStart.setDate(now.getDate() - 30);

    const [
      usersByRole,
      accountsByType,
      accountsByState,
      txTodayCount,
      txWeekCount,
      txMonthCount,
      pendingTxCount,
      txTodayCompletedSum,
      ticketsByStatus,
      activeScheduledCount,
      recentEvents,
    ] = await Promise.all([
      prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
      prisma.account.groupBy({ by: ["accountType"], _count: { _all: true } }),
      prisma.account.groupBy({ by: ["state"], _count: { _all: true } }),

      prisma.transaction.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
      prisma.transaction.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.transaction.count({ where: { createdAt: { gte: monthStart } } }),

      prisma.transaction.count({ where: { status: "PENDING" } }),
      prisma.transaction.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: todayStart, lte: todayEnd } },
        _sum: { amount: true },
      }),

      prisma.ticket.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.scheduledTransaction.count({ where: { isActive: true } }),

      prisma.eventLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { id: true, username: true, role: true } } },
      }),
    ]);

    return {
      usersByRole,
      accountsByType,
      accountsByState,
      transactions: {
        today: txTodayCount,
        last7Days: txWeekCount,
        last30Days: txMonthCount,
        pending: pendingTxCount,
        todayCompletedAmountSum: Number(txTodayCompletedSum._sum.amount ?? 0),
      },
      ticketsByStatus,
      activeScheduledCount,
      recentEvents,
      generatedAt: now,
    };
  }

  async dailyTransactionsReport(date: Date) {
    const from = startOfDay(date);
    const to = endOfDay(date);

    const [byStatus, byType, completedSum, list] = await Promise.all([
      prisma.transaction.groupBy({
        by: ["status"],
        where: { createdAt: { gte: from, lte: to } },
        _count: { _all: true },
      }),
      prisma.transaction.groupBy({
        by: ["type"],
        where: { createdAt: { gte: from, lte: to } },
        _count: { _all: true },
      }),
      prisma.transaction.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: from, lte: to } },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { createdAt: { gte: from, lte: to } },
        orderBy: { createdAt: "desc" },
        take: 200,
        include: {
          fromAccount: { select: { id: true, name: true, userId: true } },
          toAccount: { select: { id: true, name: true, userId: true } },
          approvedBy: { select: { id: true, username: true, role: true } },
        },
      }),
    ]);

    return {
      date: from.toISOString().slice(0, 10),
      totals: {
        byStatus,
        byType,
        completedAmountSum: Number(completedSum._sum.amount ?? 0),
      },
      transactions: list.map((t) => ({
        id: t.id,
        type: t.type,
        status: t.status,
        amount: Number(t.amount),
        createdAt: t.createdAt,
        fromAccount: t.fromAccount,
        toAccount: t.toAccount,
        approvedBy: t.approvedBy,
      })),
    };
  }

  async accountsSummaryReport(filters: { userId?: number; type?: string; state?: string }) {
    const where: Prisma.AccountWhereInput = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.type) where.accountType = filters.type as any;
    if (filters.state) where.state = filters.state as any;

    const [count, byType, topAccounts] = await Promise.all([
      prisma.account.count({ where }),
      prisma.account.groupBy({
        by: ["accountType"],
        where,
        _count: { _all: true },
        _sum: { balance: true },
      }),
      prisma.account.findMany({
        where,
        orderBy: { balance: "desc" },
        take: 10,
        select: { id: true, userId: true, name: true, accountType: true, state: true, balance: true },
      }),
    ]);

    return {
      totalAccounts: count,
      byType: byType.map((x) => ({
        accountType: x.accountType,
        count: x._count._all,
        totalBalance: Number(x._sum.balance ?? 0),
      })),
      topAccounts: topAccounts.map((a) => ({
        ...a,
        balance: Number(a.balance),
      })),
    };
  }

  async auditReport(filters: { from?: Date; to?: Date; userId?: number; eventType?: string }) {
    const where: Prisma.EventLogWhereInput = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.eventType) where.eventType = filters.eventType;

    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) (where.createdAt as any).gte = filters.from;
      if (filters.to) (where.createdAt as any).lte = filters.to;
    }

    const list = await prisma.eventLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 500,
      include: {
        user: { select: { id: true, username: true, role: true } },
        account: { select: { id: true, name: true } },
        transaction: { select: { id: true, type: true, status: true, amount: true } },
      },
    });

    return list.map((e) => ({
      id: e.id,
      eventType: e.eventType,
      createdAt: e.createdAt,
      details: e.details,
      user: e.user,
      account: e.account,
      transaction: e.transaction ? { ...e.transaction, amount: Number(e.transaction.amount) } : null,
    }));
  }
}
