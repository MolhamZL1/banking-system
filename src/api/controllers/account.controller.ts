// src/api/controllers/account.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AccountsService } from '../../application/services/accounts.service';

export class AccountController {
  constructor(private readonly service: AccountsService) {}

  // --- الحسابات الفردية ---
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const acc = await this.service.createAccount(req.body);
      res.status(201).json({ success: true, data: acc });
    } catch (e) { next(e); }
  };


  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const acc = await this.service.getAccount(Number(req.params.id));
      res.json({ success: true, data: acc });
    } catch (e) { next(e); }
  };

  

  changeState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.service.changeState(Number(req.params.id), req.body.action);
      res.json({ success: true, data: updated });
    } catch (e) { next(e); }
  };

  // --- إدارة المجموعات (Composite APIs) ---
  createGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const group = await this.service.createAccountGroup({userId: req.auth!.userId,
      name: req.body.name,
      childAccountIds: req.body.childAccountIds ?? [],});
      res.status(201).json({ success: true, data: group });
    } catch (e) { next(e); }
  };

  addToGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.addToGroup(
        Number(req.params.groupId), 
        Number(req.body.childAccountId)
      );
      res.json({ success: true, ...result });
    } catch (e) { next(e); }
  };

  removeFromGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.removeFromGroup(
        Number(req.params.groupId), 
        Number(req.params.childId)
      );
      res.json({ success: true, ...result });
    } catch (e) { next(e); }
  };

  // --- البحث والفلترة ---
  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        userId: req.query.userId ? Number(req.query.userId) : undefined,
        accountType: req.query.accountType as any,
        state: req.query.state as string,
        minBalance: req.query.minBalance ? Number(req.query.minBalance) : undefined,
        maxBalance: req.query.maxBalance ? Number(req.query.maxBalance) : undefined,
      };
      const results = await this.service.searchAccounts(filters);
      res.json({ success: true, data: results });
    } catch (e) { next(e); }
  };
}