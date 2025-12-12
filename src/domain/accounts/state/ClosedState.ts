
import { AccountState } from './AccountState';

export class ClosedState implements AccountState {
  name = 'CLOSED' as const;

  deposit(): void {
    throw new Error('Account is closed');
  }

  withdraw(): void {
    throw new Error('Account is closed');
  }

  freeze(): void {
    throw new Error('Account is closed');
  }

  suspend(): void {
    throw new Error('Account is closed');
  }

  activate(): void {
    throw new Error('Account is closed');
  }

  close(): void {
    // already closed
  }
}
