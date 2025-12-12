// src/domain/accounts/composite/AccountLeaf.ts
import { AccountComponent } from './AccountComponent';
import { AccountState } from '../state/AccountState';
import { ActiveState } from '../state/ActiveState';
import { InterestStrategy, InterestContext } from '../interest_strategy/InterestStrategy';


export abstract class AccountLeaf implements AccountComponent {
  protected id: string;
  protected name: string;
  protected balance: number;
  protected state: AccountState;

  constructor(id: string, name: string, initialBalance = 0) {
    this.id = id;
    this.name = name;
    this.balance = initialBalance;
    this.state = new ActiveState();
  }
  
 rename(newName: string): void {
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

  deposit(amount: number) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.state.deposit(this, amount);
  }

  withdraw(amount: number) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.state.withdraw(this, amount);
  }

  setState(s: AccountState) { this.state = s; }

  increaseBalance(a: number) { this.balance += a; }

  decreaseBalance(a: number) {
    this.assertCanWithdraw(a); 
    this.balance -= a;

  }

  protected abstract assertCanWithdraw(amount: number): void;

  calculateInterest(interestStrategy: InterestStrategy,context?: InterestContext): number {
  if (!interestStrategy) return 0;
  return interestStrategy.calculate(this.balance, context);
  }

  add(): void {
    throw new Error('Leaf account cannot have children');
  }
  remove(): void {
    throw new Error('Leaf account cannot have children');
  }
  getChildren(): AccountComponent[] {
    return [];
  }
}
