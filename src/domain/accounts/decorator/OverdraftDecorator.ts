// src/domain/accounts/decorator/OverdraftDecorator.ts
import { AccountDecorator } from './AccountDecorator';
import { CheckingAccount } from '../composite/CheckingAccount';

export class OverdraftDecorator extends AccountDecorator {
  constructor(wrap: CheckingAccount, extraLimit: number) {
    super(wrap);

    if (extraLimit <= 0) throw new Error('extraLimit must be positive');

    wrap.setOverdraftLimit(wrap.getOverdraftLimit() + extraLimit);
  }
}
