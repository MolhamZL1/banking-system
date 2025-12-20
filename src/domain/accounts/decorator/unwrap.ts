import { AccountComponent } from "../composite/AccountComponent";

export function unwrapToBase(acc: AccountComponent): any {
  let cur: any = acc;
  while (cur && typeof cur === "object" && "wrap" in cur) cur = cur.wrap;
  return cur;
}
