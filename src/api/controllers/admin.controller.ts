import { Request, Response, NextFunction } from "express";
import { AdminService } from "../../application/services/admin.service";

export class AdminController {
  constructor(private readonly service: AdminService) {}

  dashboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.dashboard();
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  dailyTx = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.dailyTx(req.query.date as string | undefined);
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  accountsSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.accountsSummary({
        userId: req.query.userId ? Number(req.query.userId) : undefined,
        type: req.query.type as string | undefined,
        state: req.query.state as string | undefined,
      });
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  audit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.audit({
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
        userId: req.query.userId ? Number(req.query.userId) : undefined,
        eventType: req.query.eventType as string | undefined,
      });
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };
}
