import { Router } from 'express';
import { DonorController } from '../controllers/donor.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Middleware to ensure user is a donor
const isDonor = (req, res, next) => {
  if (req.user.role !== 'Donor') {
    return res.status(403).json({
      message: 'Access denied. Donor role required.',
    });
  }
  next();
};

// Apply auth middleware and donor check to all routes
router.use(authMiddleware, isDonor);

// Record a donation
router.post(
  '/donations',
  [
    body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    body('units').isInt({ min: 1, max: 3 }),
    body('healthCheck').isObject(),
    body('healthCheck.hemoglobin').isFloat({ min: 0 }),
    body('healthCheck.bloodPressure').matches(/^\d{2,3}\/\d{2,3}$/),
    body('healthCheck.weight').isFloat({ min: 0 }),
    body('healthCheck.temperature').isFloat({ min: 35, max: 40 }),
    body('healthCheck.lastMeal').isISO8601(),
  ],
  DonorController.recordDonation
);

// Get donation history
router.get('/donations', DonorController.getDonationHistory);

// Check eligibility
router.get('/eligibility', DonorController.checkEligibility);

// Update health status
router.patch(
  '/health-status',
  [
    body('healthStatus').isIn(['Eligible', 'Not Eligible', 'Pending Review']),
  ],
  DonorController.updateHealthStatus
);

export default router;