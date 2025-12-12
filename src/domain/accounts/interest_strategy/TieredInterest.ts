import { InterestStrategy, InterestContext } from './InterestStrategy';

export class TieredInterest implements InterestStrategy {
  constructor(
    private tier1Limit: number,
    private tier1Rate: number,
    private tier2Rate: number
  ) {}

  calculate(balance: number, context?: InterestContext): number {
    const b = Math.max(balance, 0);
    const tier1 = Math.min(b, this.tier1Limit);
    const tier2 = Math.max(b - this.tier1Limit, 0);
    return tier1 * this.tier1Rate + tier2 * this.tier2Rate;
  }
}
