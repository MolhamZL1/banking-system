import { AccountRepo } from '../../repositories/account.repo';
import { AccountMapper } from '../mappers/account.mapper';
import { HttpError } from '../errors/http-error';
import { AccountType } from '@prisma/client';
import { AccountStateAction } from '../../domain/accounts/state';
import { AccountLeaf } from '../../domain/accounts/composite/AccountLeaf';
import { AccountGroup } from '../../domain/accounts/composite/AccountGroup';
import { NotificationCenter } from '../notifications/notification-center';
import { AccountEvent } from '../../domain/notifications/events';

import prisma from '../../infrastructure/prisma/client';
import { unwrapToBase } from '../../domain/accounts/decorator/unwrap';

export class AccountsService {
  constructor(
    private readonly repo: AccountRepo,
    private readonly notifications: NotificationCenter
  ) {}

  async createAccount(params: {
    userId: number;
    accountType: AccountType;
    initialBalance?: number;
    parentAccountId?: number;
    name: string;
  }) {
    if (params.parentAccountId) {
      const parent = await this.repo.findById(params.parentAccountId);
      if (!parent) throw new HttpError(404, 'Parent account not found');
    }

    const created = await this.repo.create({
      user: { connect: { id: params.userId } },
      accountType: params.accountType,
      name: params.name,
      balance: AccountMapper.balanceToDbDecimal(params.initialBalance ?? 0),
      parentAccount: params.parentAccountId
        ? { connect: { id: params.parentAccountId } }
        : undefined,
    });

    const event: AccountEvent = {
      type: 'ACCOUNT_CREATED',
      at: new Date(),
      userId: params.userId,
      message: `Account ${created.getName()} has been created`,
      accountId: Number(created.getId()),
      accountName: created.getName(),
    };
    await this.notifications.notify(event);

    return created;
  }

  async getAccount(id: number) {
    const acc = await this.repo.findByIdDecorated(id);
    if (!acc) throw new HttpError(404, 'Account not found');
    return acc;
  }

  async listUserAccounts(userId: number) {
    return this.repo.findManyByUserId(userId);
  }

  async listAccountsApi(requester: { userId: number; role: string }, userIdParam?: number) {
    const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
    const target = staff && userIdParam ? userIdParam : requester.userId;
    return this.listUserAccounts(target);
  }

  async renameAccountApi(requester: { userId: number; role: string }, accountId: number, newName: string) {
    const acc = await prisma.account.findUnique({ where: { id: accountId }, select: { id: true, userId: true, accountType: true } });
    if (!acc) throw new HttpError(404, "Account not found");

    const staff = ["ADMIN", "TELLER", "MANAGER"].includes(requester.role);
    if (!staff && acc.userId !== requester.userId) throw new HttpError(403, "Forbidden");

    await prisma.account.update({ where: { id: accountId }, data: { name: newName } });
    return { ok: true };
  }

  async changeState(id: number, action: AccountStateAction) {
    const account = await this.repo.findByIdDecorated(id);
    if (!account) throw new HttpError(404, 'Account not found');

    const raw: any = unwrapToBase(account as any);

    if (!(raw instanceof AccountLeaf)) {
      throw new HttpError(400, 'Cannot change state of an account group directly');
    }

    this.applyAction(raw, action);
    await this.repo.save(account);

    const owner = await this.repo.getOwnerUserIdByAccountId(id);

    const event: AccountEvent = {
      type: 'ACCOUNT_STATE_CHANGED',
      at: new Date(),
      userId: owner,
      accountId: id,
      accountName: raw.getName(),
      message: `Account ${raw.getName()} has been ${action}`,
    };
    await this.notifications.notify(event);

    return raw;
  }

  private applyAction(acc: AccountLeaf, action: AccountStateAction) {
    const actions: Record<string, () => void> = {
      [AccountStateAction.FREEZE]: () => acc.freeze(),
      [AccountStateAction.SUSPEND]: () => acc.suspend(),
      [AccountStateAction.ACTIVATE]: () => acc.activate(),
      [AccountStateAction.CLOSE]: () => acc.close(),
    };

    if (!actions[action]) throw new HttpError(400, 'Invalid action');
    actions[action]!();
  }

  async createAccountGroup(params: { userId: number; name: string; childAccountIds: number[] }) {
    const accounts = await Promise.all(params.childAccountIds.map(id => this.repo.findById(id)));
    if (accounts.some(acc => !acc)) throw new HttpError(404, 'One or more accounts not found');

    const group = await this.repo.createGroup({ userId: params.userId, name: params.name });

    await Promise.all(params.childAccountIds.map(childId => this.repo.setParent(childId, Number(group.getId()))));
    return group;
  }

  async addToGroup(groupId: number, childAccountId: number) {
    const group = await this.repo.findById(groupId);
    const child = await this.repo.findById(childAccountId);

    if (!group || !child) throw new HttpError(404, 'Account not found');
    if (!(group instanceof AccountGroup)) throw new HttpError(400, 'Target is not a group account');

    await this.repo.setParent(childAccountId, groupId);
    return { message: 'Account added to group successfully' };
  }

  async removeFromGroup(groupId: number, childAccountId: number) {
    const group = await this.repo.findById(groupId);
    const child = await this.repo.findById(childAccountId);

    if (!group || !child) throw new HttpError(404, 'Account not found');
    if (!(group instanceof AccountGroup)) throw new HttpError(400, 'Target is not a group account');

    await this.repo.removeParent(childAccountId);
    return { message: 'Account removed from group successfully' };
  }

  async addFeature(accountId: number, input: { type: 'PREMIUM'|'INSURANCE'|'OVERDRAFT_PLUS'; numberValue?: number }) {
    const acc = await prisma.account.findUnique({ where: { id: accountId } });
    if (!acc) throw new HttpError(404, 'Account not found');

    if (input.type === 'OVERDRAFT_PLUS' && acc.accountType !== 'CHECKING') {
      throw new HttpError(400, 'OVERDRAFT_PLUS only allowed for CHECKING accounts');
    }

    await this.repo.addFeature(accountId, input.type, input.numberValue);
    return { ok: true };
  }

  async removeFeature(accountId: number, type: 'PREMIUM'|'INSURANCE'|'OVERDRAFT_PLUS') {
    await this.repo.removeFeature(accountId, type);
    return { ok: true };
  }

  async searchAccounts(filters: {
    userId?: number;
    accountType?: AccountType;
    state?: string;
    minBalance?: number;
    maxBalance?: number;
  }) {
    return this.repo.search(filters);
  }
}
