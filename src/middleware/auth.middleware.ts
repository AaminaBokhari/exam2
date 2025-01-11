import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      if (typeof decoded === 'string') {
        throw new Error('Invalid token');
      }

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};