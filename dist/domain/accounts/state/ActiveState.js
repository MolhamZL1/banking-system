"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveState = void 0;
const FrozenState_1 = require("./FrozenState");
const SuspendedState_1 = require("./SuspendedState");
const ClosedState_1 = require("./ClosedState");
class ActiveState {
    constructor() {
        this.name = 'ACTIVE';
    }
    deposit(account, amount) {
        account.increaseBalance(amount);
    }
    withdraw(account, amount) {
        account.decreaseBalance(amount);
    }
    freeze(account) {
        account.setState(new FrozenState_1.FrozenState());
    }
    suspend(account) {
        account.setState(new SuspendedState_1.SuspendedState());
    }
    activate(account) {
        // already active
    }
    close(account) {
        account.setState(new ClosedState_1.ClosedState());
    }
}
exports.ActiveState = ActiveState;
