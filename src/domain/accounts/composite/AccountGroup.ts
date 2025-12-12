import { AccountComponent } from './AccountComponent';

export class AccountGroup implements AccountComponent {
  private id: string;
  private name: string;
  private children: AccountComponent[] = [];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
rename(newName: string): void {
  if (!newName.trim()) throw new Error('Group name cannot be empty');
  this.name = newName;
}

 deposit(): void {
    throw new Error('Cannot deposit directly into an account group');
  }

  withdraw(): void {
    throw new Error('Cannot withdraw directly from an account group');
  }

  getId() { return this.id; }
  getName() { return this.name; }

  add(child: AccountComponent): void {
    this.children.push(child);
  }

  remove(childId: string): void {
    this.children = this.children.filter(c => c.getId() !== childId);
  }

  getChildren(): AccountComponent[] {
    return [...this.children];
  }

  getBalance(): number {
    return this.children.reduce((sum, c) => sum + c.getBalance(), 0);
  }
}
