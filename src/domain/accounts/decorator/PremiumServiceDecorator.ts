import { AccountDecorator } from './AccountDecorator';

export class PremiumServiceDecorator extends AccountDecorator {
  constructor(wrap: any, private cashbackRate = 0.005) {
    super(wrap);
  }

  deposit(amount: number) {
    const cashback = amount * this.cashbackRate;
    return super.deposit(amount + cashback);
  }
}
