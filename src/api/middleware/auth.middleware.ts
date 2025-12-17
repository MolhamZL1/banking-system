import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../infrastructure/auth/jwt';
import { HttpError } from '../../application/errors/http-error';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: number; role: string };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new HttpError(401, 'Missing Bearer token'));

  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyToken(token);
    req.auth = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, 'Invalid token'));
  }
}

export function requireRoles(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(new HttpError(401, 'Unauthorized'));
    if (!roles.includes(req.auth.role)) return next(new HttpError(403, 'Forbidden'));
    next();
  };
}
