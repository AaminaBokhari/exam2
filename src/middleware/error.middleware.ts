import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // Handle validation errors
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.map(e => ({ field: e.param, message: e.msg }))
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  res.status(500).json({
    message: 'Internal server error'
  });
};