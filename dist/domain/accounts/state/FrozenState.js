"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrozenState = void 0;
const ActiveState_1 = require("./ActiveState");
const SuspendedState_1 = require("./SuspendedState");
const ClosedState_1 = require("./ClosedState");
class FrozenState {
    constructor() {
        this.name = 'FROZEN';
    }
    deposit(account, amount) {
        account.increaseBalance(amount);
    }
    withdraw(account, amount) {
        throw new Error('Account is frozen: withdrawals are not allowed');
    }
    freeze(account) {
        // already frozen
    }
    suspend(account) {
        account.setState(new SuspendedState_1.SuspendedState());
    }
    activate(account) {
        account.setState(new ActiveState_1.ActiveState());
    }
    close(account) {
        account.setState(new ClosedState_1.ClosedState());
    }
}
exports.FrozenState = FrozenState;
