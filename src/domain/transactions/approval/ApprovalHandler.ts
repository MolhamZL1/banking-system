import { TransactionType } from '@prisma/client';

export type TxRequest = {
  type: TransactionType;
  amount: number;
  requestedByRole: string;
};

export type ApprovalResult =
  | { approved: true; level: 'AUTO' | 'TELLER' | 'MANAGER' }
  | { approved: false; reason: string };

export abstract class ApprovalHandler {
  constructor(protected next?: ApprovalHandler) {}

  setNext(next: ApprovalHandler) {
    this.next = next;
    return next;
  }

  handle(req: TxRequest): ApprovalResult {
    const res = this.tryApprove(req);
    if (res) return res;
    if (!this.next) return { approved: false, reason: 'No approver available' };
    return this.next.handle(req);
  }

  protected abstract tryApprove(req: TxRequest): ApprovalResult | null;
}
