"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsAccount = void 0;
const AccountLeaf_1 = require("./AccountLeaf");
class SavingsAccount extends AccountLeaf_1.AccountLeaf {
    assertCanWithdraw(amount) {
        if (amount > this.balance) {
            throw new Error('Insufficient funds (savings)');
        }
    }
}
exports.SavingsAccount = SavingsAccount;
