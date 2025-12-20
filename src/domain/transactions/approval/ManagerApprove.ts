import { ApprovalHandler, TxRequest, ApprovalResult } from './ApprovalHandler';

export class ManagerApprove extends ApprovalHandler {
  protected tryApprove(req: TxRequest): ApprovalResult | null {
    const ok = ['MANAGER', 'ADMIN'].includes(req.requestedByRole);
    if (ok) return { approved: true, level: 'MANAGER' };
    return null;
  }
}
