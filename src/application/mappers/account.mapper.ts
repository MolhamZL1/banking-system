import { Account as DbAccount, AccountState as DbState } from '@prisma/client';
import { AccountFactory } from '../../domain/accounts/AccountFactory';
import { AccountComponent } from '../../domain/accounts/composite/AccountComponent';
import { AccountGroup } from '../../domain/accounts/composite/AccountGroup';
import { AccountLeaf } from '../../domain/accounts/composite/AccountLeaf';

// استيراد الـ States
import { ActiveState } from '../../domain/accounts/state/ActiveState';
import { FrozenState } from '../../domain/accounts/state/FrozenState';
import { SuspendedState } from '../../domain/accounts/state/SuspendedState';
import { ClosedState } from '../../domain/accounts/state/ClosedState';

type DbAccountWithChildren = DbAccount & { subAccounts?: DbAccount[] };

export class AccountMapper {
  static toDomain(db: DbAccountWithChildren): AccountComponent {
  if (db.accountType === 'GROUP') {
  const group = new AccountGroup(db.id.toString(), `Group#${db.id}`);

  (db.subAccounts ?? []).forEach(child => {
    group.add(this.toDomain(child));
  });

  return group;
}

    // 2. إذا لم يكن لديه -> Leaf
    const leaf = AccountFactory.create({
      id: db.id.toString(),
      name: db.name,
      type: db.accountType,
      initialBalance: Number(db.balance),
      state:db.state === 'ACTIVE' ? new ActiveState() :
            db.state === 'FROZEN' ? new FrozenState() :
            db.state === 'SUSPENDED' ? new SuspendedState() :
            new ClosedState(),
    }) as AccountLeaf;

   
    return leaf;
  }

 
  static balanceToDbDecimal(balance: number) {
    const { Prisma } = require('@prisma/client');
    return new Prisma.Decimal(balance);
  }
}