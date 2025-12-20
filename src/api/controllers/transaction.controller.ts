import { Request, Response, NextFunction } from "express";
import { TransactionsService } from "../../application/services/transactions.service";

export class TransactionController {
  constructor(private readonly service: TransactionsService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.create({
        ...req.body,
        requester: { userId: req.auth!.userId, role: req.auth!.role },
      });
      res.status(201).json({ success: true, data: out });
    } catch (e) {
      next(e);
    }
  };

  pending = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.pending({ role: req.auth!.role });
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  approve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.approve({ userId: req.auth!.userId, role: req.auth!.role }, Number(req.params.id));
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.reject({ userId: req.auth!.userId, role: req.auth!.role }, Number(req.params.id), req.body?.reason);
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };
}
