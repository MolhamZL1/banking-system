export interface InterestStrategy {
  calculate(balance: number, context?: InterestContext): number;
}

export interface InterestContext {
  marketRate?: number;  // فائدة السوق
  isPremium?: boolean;  // عميل مميز
}
