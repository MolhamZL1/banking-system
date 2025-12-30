// src/domain/accounts/decorator/InsuranceDecorator.ts

import { AccountDecorator } from "./AccountDecorator";

export class InsuranceDecorator extends AccountDecorator {
  constructor(wrap: any, private feePerWithdraw = 2) {
    super(wrap);
  }

  withdraw(amount: number) {
  
    super.withdraw(amount);

  
    super.withdraw(this.feePerWithdraw);
  }
}
