import { Request, Response, NextFunction } from "express";
import { TicketsService } from "../../application/services/tickets.service";

export class TicketController {
  constructor(private readonly service = new TicketsService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.create(req.auth!.userId, req.body);
      res.status(201).json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.list({ userId: req.auth!.userId, role: req.auth!.role });
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  setStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.setStatus(
        { role: req.auth!.role },
        Number(req.params.id),
        req.body.status
      );
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };
}
