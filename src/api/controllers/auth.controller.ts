import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';

const service = new AuthService();

export class AuthController {

   static createStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await service.createStaff(req.body);
      res.status(201).json({ success: true, data: out });
    } catch (e) { next(e); }
  };
  
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await service.register(req.body);
      res.status(201).json({ success: true, data: out });
    } catch (e) { next(e); }
  };


  static resendCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await service.resendCode(req.body.email);
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  static verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await service.verifyEmail(req.body);
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await service.login(req.body);
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  static refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await service.refresh(req.body.refreshToken);
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  static logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await service.logout(req.body.refreshToken);
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };

  static me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const out = await service.me(req.auth!.userId);
      res.json({ success: true, data: out });
    } catch (e) { next(e); }
  };
}
