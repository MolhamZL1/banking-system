import { NotificationChannel, NotificationStatus } from "@prisma/client";
import prisma from "../infrastructure/prisma/client";

export class NotificationRepo{
    
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
        status: data.status ?? 'PENDING',
      },
    });
  }

}