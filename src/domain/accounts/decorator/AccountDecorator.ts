import { AccountComponent } from "../composite/AccountComponent";


export abstract class AccountDecorator implements AccountComponent {
  constructor(protected wrap: AccountComponent) {}
  rename(newName: string): void {
    return this.wrap.rename(newName);
  }

  getId() { return this.wrap.getId(); }
  getName() { return this.wrap.getName(); }
  getBalance() { return this.wrap.getBalance(); }

 deposit(amount: number): void { this.wrap.deposit(amount); }
withdraw(amount: number): void { this.wrap.withdraw(amount); }


  add(child: AccountComponent) { return this.wrap.add(child); }
  remove(childId: string) { return this.wrap.remove(childId); }
  getChildren() { return this.wrap.getChildren(); }
}
