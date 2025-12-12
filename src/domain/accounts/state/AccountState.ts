import type { AccountLeaf } from '../composite/AccountLeaf';

export interface AccountState {
  name: 'ACTIVE' | 'FROZEN' | 'SUSPENDED' | 'CLOSED';

  deposit(account: AccountLeaf, amount: number): void;
  withdraw(account: AccountLeaf, amount: number): void;

  freeze(account: AccountLeaf): void;
  suspend(account: AccountLeaf): void;
  activate(account: AccountLeaf): void;
  close(account: AccountLeaf): void;
}
