"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckingAccount = void 0;
const ActiveState_1 = require("../state/ActiveState");
const AccountLeaf_1 = require("./AccountLeaf");
class CheckingAccount extends AccountLeaf_1.AccountLeaf {
    constructor(id, name, initialBalance = 0, overdraftLimit = 0, state = new ActiveState_1.ActiveState()) {
        super(id, name, initialBalance, state);
        this.overdraftLimit = overdraftLimit;
    }
    setOverdraftLimit(limit) {
        if (limit < 0)
            throw new Error('Overdraft limit must be >= 0');
        this.overdraftLimit = limit;
    }
    getOverdraftLimit() {
        return this.overdraftLimit;
    }
    assertCanWithdraw(amount) {
        if (this.balance - amount < -this.overdraftLimit) {
            throw new Error('Overdraft limit exceeded (checking)');
        }
    }
}
exports.CheckingAccount = CheckingAccount;
