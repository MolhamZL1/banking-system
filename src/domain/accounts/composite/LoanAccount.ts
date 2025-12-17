import { AccountLeaf } from './AccountLeaf';

export class LoanAccount extends AccountLeaf {
  protected assertCanWithdraw(amount: number): void {
    throw new Error('Withdrawals are not allowed from a loan account');
  }
  deposit(amount: number) {
    super.deposit(amount);
  }
}
