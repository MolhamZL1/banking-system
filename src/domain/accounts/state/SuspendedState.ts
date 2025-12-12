// src/domain/accounts/state/SuspendedState.ts
import type { AccountLeaf } from '../composite/AccountLeaf';
import { AccountState } from './AccountState';
import { ActiveState } from './ActiveState';
import { ClosedState } from './ClosedState';

export class SuspendedState implements AccountState {
  name = 'SUSPENDED' as const;

  deposit(account: AccountLeaf, amount: number): void {
    throw new Error('Account is suspended: transactions are not allowed');
  }

  withdraw(account: AccountLeaf, amount: number): void {
    throw new Error('Account is suspended: transactions are not allowed');
  }

  freeze(account: AccountLeaf): void {
    throw new Error('Account is suspended: cannot freeze');
  }

  suspend(account: AccountLeaf): void {
    // already suspended
  }

  activate(account: AccountLeaf): void {
    account.setState(new ActiveState());
  }

  close(account: AccountLeaf): void {
    account.setState(new ClosedState());
  }
}
