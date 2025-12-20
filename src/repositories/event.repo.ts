import prisma from "../infrastructure/prisma/client";

export class EventRepo {
  listForUser(userId: number, take = 100) {
    return prisma.eventLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });
  }

  listAll(filters?: { userId?: number }, take = 200) {
    return prisma.eventLog.findMany({
      where: { ...(filters?.userId ? { userId: filters.userId } : {}) },
      orderBy: { createdAt: "desc" },
      take,
    });
  }
}
