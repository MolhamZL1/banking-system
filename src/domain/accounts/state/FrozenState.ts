import type { AccountLeaf } from '../composite/AccountLeaf';
import { AccountState } from './AccountState';
import { ActiveState } from './ActiveState';
import { SuspendedState } from './SuspendedState';
import { ClosedState } from './ClosedState';

export class FrozenState implements AccountState {
  name = 'FROZEN' as const;

  deposit(account: AccountLeaf, amount: number): void {
    
    account.increaseBalance(amount);
  }

  withdraw(account: AccountLeaf, amount: number): void {
    throw new Error('Account is frozen: withdrawals are not allowed');
  }

  freeze(account: AccountLeaf): void {
    // already frozen
  }

  suspend(account: AccountLeaf): void {
    account.setState(new SuspendedState());
  }

  activate(account: AccountLeaf): void {
    account.setState(new ActiveState());
  }

  close(account: AccountLeaf): void {
    account.setState(new ClosedState());
  }
}
