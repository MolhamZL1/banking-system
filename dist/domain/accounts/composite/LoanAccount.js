"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanAccount = void 0;
const AccountLeaf_1 = require("./AccountLeaf");
class LoanAccount extends AccountLeaf_1.AccountLeaf {
    assertCanWithdraw(amount) {
        throw new Error('Withdrawals are not allowed from a loan account');
    }
    deposit(amount) {
        super.deposit(amount);
    }
}
exports.LoanAccount = LoanAccount;
