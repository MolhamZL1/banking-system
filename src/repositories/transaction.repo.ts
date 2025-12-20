import prisma from "../infrastructure/prisma/client";
import { Prisma, TransactionStatus } from "@prisma/client";

export class TransactionRepo {
  async atomicApplyAndMark(params: {
    txId: number;
    status: TransactionStatus;
    approvedById?: number | null;
    fromAccountId?: number;
    toAccountId?: number;
    fromNewBalance?: Prisma.Decimal;
    toNewBalance?: Prisma.Decimal;
  }) {
    return prisma.$transaction(async (tx) => {
      if (params.fromAccountId && params.fromNewBalance) {
        await tx.account.update({ where: { id: params.fromAccountId }, data: { balance: params.fromNewBalance } });
      }
      if (params.toAccountId && params.toNewBalance) {
        await tx.account.update({ where: { id: params.toAccountId }, data: { balance: params.toNewBalance } });
      }

      await tx.transaction.update({
        where: { id: params.txId },
        data: {
          status: params.status,
          approvedById: params.approvedById ?? null,
        },
      });
    });
  }

  pending() {
    return prisma.transaction.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
    });
  }
}
