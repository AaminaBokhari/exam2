import { Router } from 'express';
import { BloodBankController } from '../controllers/blood-bank.controller';
import { auth } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';
import { UserRole } from '../types';

const router = Router();

// Apply staff auth middleware to all routes
router.use(auth([UserRole.STAFF]));

// Existing routes
router.get('/inventory', BloodBankController.getInventory);
router.post('/inventory', [
  body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  body('units').isInt({ min: 1 }),
  body('donorId').isMongoId(),
], BloodBankController.addToInventory);
router.get('/requests', BloodBankController.getAllRequests);
router.patch('/requests/:requestId', [
  param('requestId').isMongoId(),
  body('status').isIn(['Approved', 'Rejected']),
  body('bloodId').optional().isMongoId(),
], BloodBankController.processRequest);

// New routes for staff donor management
router.get('/donors/:donorId/history', [
  param('donorId').isMongoId()
], BloodBankController.getDonorHistory);

router.post('/donors/:donorId/schedule', [
  param('donorId').isMongoId(),
  body('appointmentDate').isISO8601(),
  body('bloodCenter').notEmpty()
], BloodBankController.scheduleDonorAppointment);

export default router;