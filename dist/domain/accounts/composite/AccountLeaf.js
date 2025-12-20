"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountLeaf = void 0;
const ActiveState_1 = require("../state/ActiveState");
class AccountLeaf {
    constructor(id, name, initialBalance = 0, state = new ActiveState_1.ActiveState()) {
        this.id = id;
        this.name = name;
        this.balance = initialBalance;
        this.state = state;
    }
    rename(newName) {
        if (!newName.trim()) {
            throw new Error('Account name cannot be empty');
        }
        this.name = newName;
    }
    getId() { return this.id; }
    getName() { return this.name; }
    getBalance() { return this.balance; }
    getState() { return this.state.name; }
    freeze() { this.state.freeze(this); }
    suspend() { this.state.suspend(this); }
    activate() { this.state.activate(this); }
    close() { this.state.close(this); }
    deposit(amount) {
        if (amount <= 0)
            throw new Error('Amount must be positive');
        this.state.deposit(this, amount);
    }
    withdraw(amount) {
        if (amount <= 0)
            throw new Error('Amount must be positive');
        this.state.withdraw(this, amount);
    }
    setState(s) { this.state = s; }
    increaseBalance(a) { this.balance += a; }
    decreaseBalance(a) {
        this.assertCanWithdraw(a);
        this.balance -= a;
    }
    calculateInterest(interestStrategy, context) {
        if (!interestStrategy)
            return 0;
        return interestStrategy.calculate(this.balance, context);
    }
    add() {
        throw new Error('Leaf account cannot have children');
    }
    remove() {
        throw new Error('Leaf account cannot have children');
    }
    getChildren() {
        return [];
    }
}
exports.AccountLeaf = AccountLeaf;
