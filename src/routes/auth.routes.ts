import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';
import { UserRole } from '../types';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', auth([UserRole.DONOR, UserRole.RECIPIENT, UserRole.STAFF]), AuthController.getProfile);
router.patch('/profile', auth([UserRole.DONOR, UserRole.RECIPIENT, UserRole.STAFF]), AuthController.updateProfile);

export default router;