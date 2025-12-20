import { AccountComponent } from "../composite/AccountComponent";
import { CheckingAccount } from "../composite/CheckingAccount";
import { InsuranceDecorator } from "./InsuranceDecorator";
import { PremiumServiceDecorator } from "./PremiumServiceDecorator";
import { OverdraftDecorator } from "./OverdraftDecorator";
import { unwrapToBase } from "./unwrap";

export type FeatureRow = {
  type: "PREMIUM" | "INSURANCE" | "OVERDRAFT_PLUS";
  numberValue?: number | null;
};

export function applyDecorators(base: AccountComponent, features: FeatureRow[]): AccountComponent {
  let acc: AccountComponent = base;
  const overdraft = features.find(f => f.type === "OVERDRAFT_PLUS");
  if (overdraft) {
    const raw = unwrapToBase(base);
    if (raw instanceof CheckingAccount) {
      const extra = overdraft.numberValue ?? 100;
      acc = new OverdraftDecorator(raw, extra);
    }
  }

  for (const f of features) {
    if (f.type === "PREMIUM") {
      acc = new PremiumServiceDecorator(acc as any, 0.005);
    }
    if (f.type === "INSURANCE") {
      const fee = f.numberValue ?? 2;
      acc = new InsuranceDecorator(acc as any, fee);
    }
  }

  return acc;
}
