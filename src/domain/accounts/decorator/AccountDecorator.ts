import { AccountComponent } from "../composite/AccountComponent";


export abstract class AccountDecorator implements AccountComponent {
  constructor(protected wrap: AccountComponent) {}

  getId() { return this.wrap.getId(); }
  getName() { return this.wrap.getName(); }
  getBalance() { return this.wrap.getBalance(); }

  deposit(amount: number) { return this.wrap.deposit(amount); }
  withdraw(amount: number) { return this.wrap.withdraw(amount); }

  add(child: AccountComponent) { return this.wrap.add(child); }
  remove(childId: string) { return this.wrap.remove(childId); }
  getChildren() { return this.wrap.getChildren(); }
}
