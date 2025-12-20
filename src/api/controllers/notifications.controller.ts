import { Request, Response, NextFunction } from "express";
import { NotificationsService } from "../../application/services/notifications.service";

export class NotificationsController {
  constructor(private readonly service = new NotificationsService()) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.list(req.auth!.userId);
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  read = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await this.service.markRead(req.auth!.userId, Number(req.params.id));
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };
}
