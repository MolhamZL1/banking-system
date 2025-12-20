"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountFactory = void 0;
const SavingsAccount_1 = require("./composite/SavingsAccount");
const CheckingAccount_1 = require("./composite/CheckingAccount");
const LoanAccount_1 = require("./composite/LoanAccount");
const InvestmentAccount_1 = require("./composite/InvestmentAccount");
class AccountFactory {
    static create(params) {
        const bal = params.initialBalance ?? 0;
        switch (params.type) {
            case 'SAVINGS':
                return new SavingsAccount_1.SavingsAccount(params.id, params.name, bal, params.state);
            case 'CHECKING':
                return new CheckingAccount_1.CheckingAccount(params.id, params.name, bal, params.overdraftLimit ?? 0, params.state);
            case 'LOAN':
                return new LoanAccount_1.LoanAccount(params.id, params.name, bal, params.state);
            case 'INVESTMENT':
                return new InvestmentAccount_1.InvestmentAccount(params.id, params.name, bal, params.state);
            default:
                throw new Error(`Unsupported account type: ${params.type}`);
        }
    }
}
exports.AccountFactory = AccountFactory;
