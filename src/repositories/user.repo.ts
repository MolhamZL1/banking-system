import prisma from '../infrastructure/prisma/client';
import { Prisma } from '@prisma/client';

export class UserRepo {
  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  setEmailVerified(id: number) {
    return prisma.user.update({ where: { id }, data: { isEmailVerified: true } });
  }
}
