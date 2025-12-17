import { AccountRepo } from '../../repositories/account.repo';
import { AccountMapper } from '../mappers/account.mapper';
import { HttpError } from '../errors/http-error';
import { AccountType } from '@prisma/client';
import { AccountStateAction } from '../../domain/accounts/state';
import { AccountLeaf } from '../../domain/accounts/composite/AccountLeaf';
import { AccountGroup } from '../../domain/accounts/composite/AccountGroup';
import { NotificationCenter } from '../notifications/notification-center';
import { AccountEvent } from '../../domain/notifications/events';

export class AccountsService {
  constructor(private readonly repo: AccountRepo,   private readonly notifications: NotificationCenter) {}

  async createAccount(params: {
    userId: number;
    accountType: AccountType;
    initialBalance?: number;
    parentAccountId?: number;
    name:string
  }) {
    if (params.parentAccountId) {
      const parent = await this.repo.findById(params.parentAccountId);
      if (!parent) throw new HttpError(404, 'Parent account not found');
    }
const created =await this.repo.create({
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

    return created ;
  }

  async getAccount(id: number) {
    const acc = await this.repo.findById(id);
    if (!acc) throw new HttpError(404, 'Account not found');
    return acc;
  }

  async listUserAccounts(userId: number) {
    return this.repo.findManyByUserId(userId);
  }

   async changeState(id: number, action: AccountStateAction) {
    const account = await this.repo.findById(id);
    if (!account) throw new HttpError(404, 'Account not found');

    if (!(account instanceof AccountLeaf)) {
      throw new HttpError(400, 'Cannot change state of an account group directly');
    }

    this.applyAction(account, action);
    await this.repo.save(account);

    const owner = await this.repo.getOwnerUserIdByAccountId(id);

    const event: AccountEvent = {
      type: 'ACCOUNT_STATE_CHANGED',
      at: new Date(),
      userId: owner,
      accountId: id,
      accountName: account.getName(),
      message: `Account ${account.getName()} has been ${action}`,
    };
    await this.notifications.notify(event);

    return account;
  }

  private applyAction(acc: AccountLeaf, action: AccountStateAction) {
    const actions: Record<string, () => void> = {
      [AccountStateAction.FREEZE]: () => acc.freeze(),
      [AccountStateAction.SUSPEND]: () => acc.suspend(),
      [AccountStateAction.ACTIVATE]: () => acc.activate(),
      [AccountStateAction.CLOSE]: () => acc.close(),
    };

    if (!actions[action]) throw new HttpError(400, 'Invalid action');
    actions[action]();
  }

  // إنشاء مجموعة حسابات
  async createAccountGroup(params: {
    userId: number;
    name: string;
    childAccountIds: number[];
  }) {
    // التحقق من أن جميع الحسابات موجودة وتنتمي للمستخدم
    const accounts = await Promise.all(
      params.childAccountIds.map(id => this.repo.findById(id))
    );

    if (accounts.some(acc => !acc)) {
      throw new HttpError(404, 'One or more accounts not found');
    }

    // إنشاء حساب مجموعة في قاعدة البيانات
    // ملاحظة: هذا يتطلب تعديل Schema لدعم المجموعات بشكل أفضل
    const group = await this.repo.createGroup({
      userId: params.userId,
      name: params.name,
    });

    // ربط الحسابات الفرعية بالمجموعة
    await Promise.all(
      params.childAccountIds.map(childId =>
        this.repo.setParent(childId, Number(group.getId()))
      )
    );

    return group;
  }

  // إضافة حساب لمجموعة
  async addToGroup(groupId: number, childAccountId: number) {
    const group = await this.repo.findById(groupId);
    const child = await this.repo.findById(childAccountId);

    if (!group || !child) throw new HttpError(404, 'Account not found');
    if (!(group instanceof AccountGroup)) {
      throw new HttpError(400, 'Target is not a group account');
    }

    await this.repo.setParent(childAccountId, groupId);
    return { message: 'Account added to group successfully' };
  }

  // إزالة حساب من مجموعة
  async removeFromGroup(groupId: number, childAccountId: number) {
    const group = await this.repo.findById(groupId);
    const child = await this.repo.findById(childAccountId);

    if (!group || !child) throw new HttpError(404, 'Account not found');
    if (!(group instanceof AccountGroup)) {
      throw new HttpError(400, 'Target is not a group account');
    }

    await this.repo.removeParent(childAccountId);
    return { message: 'Account removed from group successfully' };
  }

  // // الحصول على ملخص حساب شامل
  // async getAccountSummary(id: number) {
  //   const account = await this.repo.findByIdWithDetails(id);
  //   if (!account) throw new HttpError(404, 'Account not found');

  //   const recentTransactions = await this.repo.getRecentTransactions(id, 10);
    
  //   return {
  //     account: {
  //       id: account.getId(),
  //       name: account.getName(),
  //       balance: account.getBalance(),
  //       type: account instanceof AccountLeaf ? 'leaf' : 'group',
  //     },
  //     recentTransactions,
  //     children: account.getChildren().map(child => ({
  //       id: child.getId(),
  //       name: child.getName(),
  //       balance: child.getBalance(),
  //     })),
  //   };
  // }

  // البحث عن الحسابات
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
