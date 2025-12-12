import type { AccountLeaf } from '../composite/AccountLeaf';
import { AccountState } from './AccountState';
import { FrozenState } from './FrozenState';
import { SuspendedState } from './SuspendedState';
import { ClosedState } from './ClosedState';

export class ActiveState implements AccountState {
  name = 'ACTIVE' as const;

  deposit(account: AccountLeaf, amount: number): void {
    account.increaseBalance(amount);
  }

  withdraw(account: AccountLeaf, amount: number): void {
    account.decreaseBalance(amount); // leaf rules (insufficient/overdraft..) inside
  }

  freeze(account: AccountLeaf): void {
    account.setState(new FrozenState());
  }

  suspend(account: AccountLeaf): void {
    account.setState(new SuspendedState());
  }

  activate(account: AccountLeaf): void {
    // already active
  }

  close(account: AccountLeaf): void {
    account.setState(new ClosedState());
  }
}
