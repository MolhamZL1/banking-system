import { NotificationChannel, NotificationStatus, Prisma } from "@prisma/client";
import prisma from "../infrastructure/prisma/client";

export class NotificationRepo {
  async create(data: {
    userId: number;
    relatedAccountId?: number;
    relatedTransactionId?: number;
    channel: NotificationChannel;
    message: string;
    status?: NotificationStatus;
  }) {
    return prisma.notification.create({
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

  async listByUser(userId: number, take = 50) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });
  }

  async markRead(userId: number, id: number) {
    return prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
