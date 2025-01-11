import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';
import { UserRole } from '../types';
import { body } from 'express-validator';

const router = Router();

// ... existing routes ...

router.post('/forgot-password',
  [body('email').isEmail()],
  AuthController.forgotPassword
);

router.post('/reset-password',
  [
    body('token').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  AuthController.resetPassword
);

router.get('/verify-email/:token',
  AuthController.verifyEmail
);

export default router;