import { SavingsAccount } from "../../domain/accounts/composite/SavingsAccount";
import { CheckingAccount } from "../../domain/accounts/composite/CheckingAccount";
import { AccountGroup } from "../../domain/accounts/composite/AccountGroup";
import { ActiveState } from "../../domain/accounts/state/ActiveState";
import { FrozenState } from "../../domain/accounts/state/FrozenState";
import { PremiumServiceDecorator } from "../../domain/accounts/decorator/PremiumServiceDecorator";
import { InsuranceDecorator } from "../../domain/accounts/decorator/InsuranceDecorator";
import { OverdraftDecorator } from "../../domain/accounts/decorator/OverdraftDecorator";

describe("Accounts Domain (Composite + State + Decorator)", () => {
  test("Savings deposit/withdraw works in ACTIVE", () => {
    const acc = new SavingsAccount("1", "sav", 100, new ActiveState());
    acc.deposit(50);
    expect(acc.getBalance()).toBe(150);
    acc.withdraw(20);
    expect(acc.getBalance()).toBe(130);
  });

  test("Frozen blocks withdraw", () => {
    const acc = new SavingsAccount("1", "sav", 100, new FrozenState());
    expect(() => acc.withdraw(10)).toThrow();
  });

  test("Composite group sums children balances", () => {
    const g = new AccountGroup("g1", "group");
    const a1 = new SavingsAccount("1", "a1", 50, new ActiveState());
    const a2 = new SavingsAccount("2", "a2", 70, new ActiveState());
    g.add(a1);
    g.add(a2);
    expect(g.getBalance()).toBe(120);
  });

  test("Decorator: Premium adds cashback on deposit", () => {
    const base = new SavingsAccount("1", "sav", 0, new ActiveState());
    const premium = new PremiumServiceDecorator(base as any, 0.1);
    premium.deposit(100);
    expect(premium.getBalance()).toBe(110);
  });

  test("Decorator: Insurance charges fee on withdraw", () => {
    const base = new SavingsAccount("1", "sav", 100, new ActiveState());
    const insured = new InsuranceDecorator(base as any, 2);
    insured.withdraw(10);
    expect(insured.getBalance()).toBe(88);
  });

  test("Decorator: Overdraft increases checking limit", () => {
    const chk = new CheckingAccount("1", "chk", 0, 0, new ActiveState());
    new OverdraftDecorator(chk, 100);
    chk.withdraw(50);
    expect(chk.getBalance()).toBe(-50);
  });
});
