import { AccountLeaf } from './AccountLeaf';

export class SavingsAccount extends AccountLeaf {
  protected assertCanWithdraw(amount: number): void {
    if (amount > this.balance) {
      throw new Error('Insufficient funds (savings)');
    }
  }
}
