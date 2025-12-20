"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SavingsAccount_1 = require("../../domain/accounts/composite/SavingsAccount");
const CheckingAccount_1 = require("../../domain/accounts/composite/CheckingAccount");
const AccountGroup_1 = require("../../domain/accounts/composite/AccountGroup");
const ActiveState_1 = require("../../domain/accounts/state/ActiveState");
const FrozenState_1 = require("../../domain/accounts/state/FrozenState");
const PremiumServiceDecorator_1 = require("../../domain/accounts/decorator/PremiumServiceDecorator");
const InsuranceDecorator_1 = require("../../domain/accounts/decorator/InsuranceDecorator");
const OverdraftDecorator_1 = require("../../domain/accounts/decorator/OverdraftDecorator");
describe("Accounts Domain (Composite + State + Decorator)", () => {
    test("Savings deposit/withdraw works in ACTIVE", () => {
        const acc = new SavingsAccount_1.SavingsAccount("1", "sav", 100, new ActiveState_1.ActiveState());
        acc.deposit(50);
        expect(acc.getBalance()).toBe(150);
        acc.withdraw(20);
        expect(acc.getBalance()).toBe(130);
    });
    test("Frozen blocks withdraw", () => {
        const acc = new SavingsAccount_1.SavingsAccount("1", "sav", 100, new FrozenState_1.FrozenState());
        expect(() => acc.withdraw(10)).toThrow();
    });
    test("Composite group sums children balances", () => {
        const g = new AccountGroup_1.AccountGroup("g1", "group");
        const a1 = new SavingsAccount_1.SavingsAccount("1", "a1", 50, new ActiveState_1.ActiveState());
        const a2 = new SavingsAccount_1.SavingsAccount("2", "a2", 70, new ActiveState_1.ActiveState());
        g.add(a1);
        g.add(a2);
        expect(g.getBalance()).toBe(120);
    });
    test("Decorator: Premium adds cashback on deposit", () => {
        const base = new SavingsAccount_1.SavingsAccount("1", "sav", 0, new ActiveState_1.ActiveState());
        const premium = new PremiumServiceDecorator_1.PremiumServiceDecorator(base, 0.1);
        premium.deposit(100);
        expect(premium.getBalance()).toBe(110);
    });
    test("Decorator: Insurance charges fee on withdraw", () => {
        const base = new SavingsAccount_1.SavingsAccount("1", "sav", 100, new ActiveState_1.ActiveState());
        const insured = new InsuranceDecorator_1.InsuranceDecorator(base, 2);
        insured.withdraw(10);
        expect(insured.getBalance()).toBe(88);
    });
    test("Decorator: Overdraft increases checking limit", () => {
        const chk = new CheckingAccount_1.CheckingAccount("1", "chk", 0, 0, new ActiveState_1.ActiveState());
        new OverdraftDecorator_1.OverdraftDecorator(chk, 100);
        chk.withdraw(50);
        expect(chk.getBalance()).toBe(-50);
    });
});
