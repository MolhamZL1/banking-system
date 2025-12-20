"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountGroup = void 0;
class AccountGroup {
    constructor(id, name) {
        this.children = [];
        this.id = id;
        this.name = name;
    }
    rename(newName) {
        if (!newName.trim())
            throw new Error('Group name cannot be empty');
        this.name = newName;
    }
    deposit() {
        throw new Error('Cannot deposit directly into an account group');
    }
    withdraw() {
        throw new Error('Cannot withdraw directly from an account group');
    }
    getId() { return this.id; }
    getName() { return this.name; }
    add(child) {
        this.children.push(child);
    }
    remove(childId) {
        this.children = this.children.filter(c => c.getId() !== childId);
    }
    getChildren() {
        return [...this.children];
    }
    getBalance() {
        return this.children.reduce((sum, c) => sum + c.getBalance(), 0);
    }
}
exports.AccountGroup = AccountGroup;
