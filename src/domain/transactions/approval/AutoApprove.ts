import { ApprovalHandler, TxRequest, ApprovalResult } from './ApprovalHandler';

export class AutoApprove extends ApprovalHandler {
  constructor(private maxAmount = 100) {
    super();
  }

  protected tryApprove(req: TxRequest): ApprovalResult | null {
    if (req.amount <= this.maxAmount) return { approved: true, level: 'AUTO' };
    return null;
  }
}
