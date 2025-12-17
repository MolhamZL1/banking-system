import prisma from '../infrastructure/prisma/client';

export class EmailVerificationRepo {
  create(email: string, codeHash: string, expiresAt: Date) {
    return prisma.emailVerification.create({ data: { email, codeHash, expiresAt } });
  }

  findValid(email: string, codeHash: string) {
    return prisma.emailVerification.findFirst({
      where: { email, codeHash, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
  }

  markUsed(id: number) {
    return prisma.emailVerification.update({ where: { id }, data: { usedAt: new Date() } });
  }
}
