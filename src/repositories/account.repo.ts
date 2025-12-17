import prisma from '../infrastructure/prisma/client'; 
import { AccountMapper } from '../application/mappers/account.mapper';
import { AccountComponent } from '../domain/accounts/composite/AccountComponent';
import { AccountLeaf } from '../domain/accounts/composite/AccountLeaf';
import { AccountState, AccountType } from '@prisma/client';

export class AccountRepo {
  async findById(id: number): Promise<AccountComponent | null> {
    const dbAcc = await prisma.account.findUnique({ 
      where: { id },
      include: { subAccounts: true }
    });
    if (!dbAcc) return null;
    
    return AccountMapper.toDomain(dbAcc);
  }

  // async findByIdWithDetails(id: number): Promise<AccountComponent | null> {
  //   const dbAcc = await prisma.account.findUnique({ 
  //     where: { id },
  //     include: { 
  //       subAccounts: true,
  //       transactions: {
  //         orderBy: { createdAt: 'desc' },
  //         take: 10,
  //       },
  //     }
  //   });
  //   if (!dbAcc) return null;
    
  //   return AccountMapper.toDomain(dbAcc);
  // }

  async save(account: AccountComponent): Promise<void> {
    const data: any = {
      balance: AccountMapper.balanceToDbDecimal(account.getBalance()),
    };

    if (account instanceof AccountLeaf) {
      data.state = account.getState() as AccountState;
    }

    await prisma.account.update({
      where: { id: Number(account.getId()) },
      data
    });
  }

  async create(data: any) {
    const dbAccount = await prisma.account.create({ data });
    return AccountMapper.toDomain(dbAccount);
  }

  async createGroup(params: { userId: number; name: string }) {
    const dbAccount = await prisma.account.create({
      data: {
        userId: params.userId,
        accountType: 'GROUP', 
        balance: 0,
        state: 'ACTIVE',
        name: params.name
      },
    });
    return AccountMapper.toDomain(dbAccount);
  }

  async setParent(childId: number, parentId: number) {
    await prisma.account.update({
      where: { id: childId },
      data: { parentAccountId: parentId },
    });
  }

  async removeParent(childId: number) {
    await prisma.account.update({
      where: { id: childId },
      data: { parentAccountId: null },
    });
  }

  async findManyByUserId(userId: number): Promise<AccountComponent[]> {
    const list = await prisma.account.findMany({ 
      where: { userId, parentAccountId: null }, // فقط الحسابات الرئيسية
      include: { subAccounts: true }
    });
    return list.map(acc => AccountMapper.toDomain(acc));
  }
  async search(filters: {
    userId?: number;
    accountType?: AccountType;
    state?: string;
    minBalance?: number;
    maxBalance?: number;
  }) {
    const where: any = {};
    
    if (filters.userId) where.userId = filters.userId;
    if (filters.accountType) where.accountType = filters.accountType;
    if (filters.state) where.state = filters.state;
    
    if (filters.minBalance !== undefined || filters.maxBalance !== undefined) {
      where.balance = {};
      if (filters.minBalance !== undefined) where.balance.gte = filters.minBalance;
      if (filters.maxBalance !== undefined) where.balance.lte = filters.maxBalance;
    }

    const accounts = await prisma.account.findMany({
      where,
      include: { user: { select: { username: true, email: true } } },
    });

    return accounts.map(acc => ({
      id: acc.id,
      type: acc.accountType,
      balance: Number(acc.balance),
      state: acc.state,
      user: acc.user,
    }));
  }
  async getOwnerUserIdByAccountId(accountId: number): Promise<number> {
  const acc = await prisma.account.findUnique({
    where: { id: accountId },
    select: { userId: true },
  });
  if (!acc) throw new Error('Account not found');
  return acc.userId;
}

}
