import { AccountType } from './types';
import { AccountLeaf } from './composite/AccountLeaf';
import { SavingsAccount } from './composite/SavingsAccount';
import { CheckingAccount } from './composite/CheckingAccount';
import { LoanAccount } from './composite/LoanAccount';
import { InvestmentAccount } from './composite/InvestmentAccount';
import { AccountState } from '../accounts/state/AccountState';

export class AccountFactory {
  static create(params: {
    id: string;
    name: string;
    type: AccountType;
    initialBalance?: number;
    overdraftLimit?: number; 
    state :AccountState
  }): AccountLeaf {
    const bal = params.initialBalance ?? 0;

    switch (params.type) {
      case 'SAVINGS':
        return new SavingsAccount(params.id, params.name, bal, params.state);
     case 'CHECKING':
  return new CheckingAccount(
    params.id,
    params.name,
    bal,
    params.overdraftLimit ?? 0,
    params.state
  );

      case 'LOAN':
        return new LoanAccount(params.id, params.name, bal, params.state);

      case 'INVESTMENT':
        return new InvestmentAccount(params.id, params.name, bal, params.state);
        
      default:
        throw new Error(`Unsupported account type: ${params.type}`);
    }
  }
}
