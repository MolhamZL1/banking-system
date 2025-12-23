import { FixedRateInterest } from "../../domain/accounts/interest_strategy/FixedRateInterest";
import { MarketBasedInterest } from "../../domain/accounts/interest_strategy/MarketBasedInterest";
import { TieredInterest } from "../../domain/accounts/interest_strategy/TieredInterest";

describe("Interest Strategies", () => {
  test("FixedRateInterest: annualRate applied on positive balance, clamps negatives to 0", () => {
    const s = new FixedRateInterest(0.1);
    expect(s.calculate(100)).toBe(10);
    expect(s.calculate(-50)).toBe(0);
  });

  test("MarketBasedInterest: uses base + market + premium bonus", () => {
    const s = new MarketBasedInterest(0.02, 0.01);
    expect(s.calculate(100, { marketRate: 0.03, isPremium: true })).toBe(100 * (0.02 + 0.03 + 0.01));
    expect(s.calculate(100, { marketRate: 0.03, isPremium: false })).toBe(100 * (0.02 + 0.03));
  });

  test("TieredInterest: splits into tier1 + tier2", () => {
    const s = new TieredInterest(100, 0.01, 0.02);
    expect(s.calculate(50)).toBe(50 * 0.01);
    expect(s.calculate(150)).toBe(100 * 0.01 + 50 * 0.02);
  });
});
