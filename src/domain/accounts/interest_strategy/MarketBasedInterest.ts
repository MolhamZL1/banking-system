import { InterestStrategy, InterestContext } from './InterestStrategy';

export class MarketBasedInterest implements InterestStrategy {
  constructor(private baseRate: number, private premiumBonus = 0.01) {}

  calculate(balance: number, context?: InterestContext): number {
    const b = Math.max(balance, 0);
    const market = context?.marketRate ?? 0;
    const premium = context?.isPremium ? this.premiumBonus : 0;
    return b * (this.baseRate + market + premium);
  }
}
