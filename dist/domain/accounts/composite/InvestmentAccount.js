"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentAccount = void 0;
const AccountLeaf_1 = require("./AccountLeaf");
class InvestmentAccount extends AccountLeaf_1.AccountLeaf {
    assertCanWithdraw(amount) {
        if (amount > this.balance) {
            throw new Error('Insufficient funds (investment)');
        }
    }
}
exports.InvestmentAccount = InvestmentAccount;
