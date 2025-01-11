import { Router } from 'express';
import { BloodBankController } from '../controllers/blood-bank.controller';
import { auth } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';
import { UserRole } from '../types';

const router = Router();

// Apply staff auth middleware to all routes
router.use(auth([UserRole.STAFF]));

// View blood inventory
router.get('/inventory', BloodBankController.getInventory);

// Add to blood inventory
router.post(
  '/inventory',
  [
    body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    body('units').isInt({ min: 1 }),
    body('donorId').isMongoId(),
  ],
  BloodBankController.addToInventory
);

// View all requests
router.get('/requests', BloodBankController.getAllRequests);

// Process a request
router.patch(
  '/requests/:requestId',
  [
    param('requestId').isMongoId(),
    body('status').isIn(['Approved', 'Rejected']),
    body('bloodId').optional().isMongoId(),
  ],
  BloodBankController.processRequest
);

export default router;