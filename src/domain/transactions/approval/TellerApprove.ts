import { ApprovalHandler, TxRequest, ApprovalResult } from './ApprovalHandler';

export class TellerApprove extends ApprovalHandler {
  constructor(private maxAmount = 1000) {
    super();
  }

  protected tryApprove(req: TxRequest): ApprovalResult | null {
    const staff = ['TELLER', 'MANAGER', 'ADMIN'].includes(req.requestedByRole);
    if (staff && req.amount <= this.maxAmount) return { approved: true, level: 'TELLER' };
    return null;
  }
}
