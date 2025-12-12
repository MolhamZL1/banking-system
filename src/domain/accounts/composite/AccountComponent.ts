export interface AccountComponent {
  getId(): string;
  getName(): string;
  getBalance(): number;

  rename(newName: string): void;

  deposit(amount: number): void;
  withdraw(amount: number): void;

  add(child: AccountComponent): void;
  remove(childId: string): void;
  getChildren(): AccountComponent[];
}
