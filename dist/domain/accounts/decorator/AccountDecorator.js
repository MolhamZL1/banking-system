"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDecorator = void 0;
class AccountDecorator {
    constructor(wrap) {
        this.wrap = wrap;
    }
    rename(newName) {
        return this.wrap.rename(newName);
    }
    getId() { return this.wrap.getId(); }
    getName() { return this.wrap.getName(); }
    getBalance() { return this.wrap.getBalance(); }
    deposit(amount) { this.wrap.deposit(amount); }
    withdraw(amount) { this.wrap.withdraw(amount); }
    add(child) { return this.wrap.add(child); }
    remove(childId) { return this.wrap.remove(childId); }
    getChildren() { return this.wrap.getChildren(); }
}
exports.AccountDecorator = AccountDecorator;
