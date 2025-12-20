"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuspendedState = void 0;
const ActiveState_1 = require("./ActiveState");
const ClosedState_1 = require("./ClosedState");
class SuspendedState {
    constructor() {
        this.name = 'SUSPENDED';
    }
    deposit(account, amount) {
        throw new Error('Account is suspended: transactions are not allowed');
    }
    withdraw(account, amount) {
        throw new Error('Account is suspended: transactions are not allowed');
    }
    freeze(account) {
        throw new Error('Account is suspended: cannot freeze');
    }
    suspend(account) {
        // already suspended
    }
    activate(account) {
        account.setState(new ActiveState_1.ActiveState());
    }
    close(account) {
        account.setState(new ClosedState_1.ClosedState());
    }
}
exports.SuspendedState = SuspendedState;
