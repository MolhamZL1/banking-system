import { InterestStrategy, InterestContext } from './InterestStrategy';

export class FixedRateInterest implements InterestStrategy {
  constructor(private annualRate: number) {}

  calculate(balance: number, context?: InterestContext): number {
    return Math.max(balance, 0) * this.annualRate;
  }
}
