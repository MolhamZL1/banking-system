import { AccountLeaf } from './AccountLeaf';

export class CheckingAccount extends AccountLeaf {
  private overdraftLimit: number;

  constructor(id: string, name: string, initialBalance = 0, overdraftLimit = 0) {
    super(id, name, initialBalance);
    this.overdraftLimit = overdraftLimit;
  }

  setOverdraftLimit(limit: number) {
    if (limit < 0) throw new Error('Overdraft limit must be >= 0');
    this.overdraftLimit = limit;
  }

  getOverdraftLimit() {
    return this.overdraftLimit;
  }

  protected assertCanWithdraw(amount: number): void {
    if (this.balance - amount < -this.overdraftLimit) {
      throw new Error('Overdraft limit exceeded (checking)');
    }
  }
}
