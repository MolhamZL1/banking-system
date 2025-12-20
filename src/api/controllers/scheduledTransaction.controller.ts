import { Request, Response, NextFunction } from "express";
import { ScheduledTransactionsService } from "../../application/services/scheduledTransactions.service";

export class ScheduledTransactionController {
  constructor(private readonly service = new ScheduledTransactionsService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.create({ userId: req.auth!.userId }, req.body);
      res.status(201).json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.list({ userId: req.auth!.userId });
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  stop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.stop({ userId: req.auth!.userId }, Number(req.params.id));
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  resume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.resume({ userId: req.auth!.userId }, Number(req.params.id));
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };
}
