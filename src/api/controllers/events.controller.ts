import { Request, Response, NextFunction } from "express";
import { EventsService } from "../../application/services/events.service";

export class EventsController {
  constructor(private readonly service = new EventsService()) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const out = await this.service.list(
        { userId: req.auth!.userId, role: req.auth!.role },
        userId ? { userId } : undefined
      );
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };
}
