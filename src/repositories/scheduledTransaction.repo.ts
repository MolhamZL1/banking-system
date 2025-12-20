import prisma from "../infrastructure/prisma/client";
import { Prisma, TransactionType, Frequency } from "@prisma/client";

export class ScheduledTransactionRepo {
  create(input: {
    createdById: number;
    fromAccountId?: number;
    toAccountId?: number;
    amount: number;
    type: TransactionType;
    frequency: Frequency;
    nextRunAt: Date;
  }) {
    const amountDec = new Prisma.Decimal(input.amount);
    return prisma.scheduledTransaction.create({
      data: {
        createdById: input.createdById,
        fromAccountId: input.fromAccountId ?? null,
        toAccountId: input.toAccountId ?? null,
        amount: amountDec,
        type: input.type,
        frequency: input.frequency,
        nextRunAt: input.nextRunAt,
      },
    });
  }

  listByUser(createdById: number) {
    return prisma.scheduledTransaction.findMany({
      where: { createdById },
      orderBy: { createdAt: "desc" },
    });
  }

  stop(createdById: number, id: number) {
    return prisma.scheduledTransaction.updateMany({
      where: { id, createdById },
      data: { isActive: false },
    });
  }

  resume(createdById: number, id: number) {
    return prisma.scheduledTransaction.updateMany({
      where: { id, createdById },
      data: { isActive: true },
    });
  }

  listDue() {
    return prisma.scheduledTransaction.findMany({
      where: { isActive: true, nextRunAt: { lte: new Date() } },
    });
  }

  updateNextRun(id: number, nextRunAt: Date) {
    return prisma.scheduledTransaction.update({ where: { id }, data: { nextRunAt } });
  }
}
