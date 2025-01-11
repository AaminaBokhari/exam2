import { Router } from 'express';
import { RecipientController } from '../controllers/recipient.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';

const router = Router();

// Middleware to ensure user is a recipient
const isRecipient = (req, res, next) => {
  if (req.user.role !== 'Recipient') {
    return res.status(403).json({
      message: 'Access denied. Recipient role required.',
    });
  }
  next();
};

// Apply auth middleware and recipient check to all routes
router.use(authMiddleware, isRecipient);

// Create a blood request
router.post(
  '/requests',
  [
    body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    body('units').isInt({ min: 1 }),
    body('urgency').isIn(['Normal', 'Urgent', 'Critical']),
    body('hospitalName').notEmpty(),
    body('diagnosisDetails').notEmpty(),
    body('requiredDate').isISO8601(),
  ],
  RecipientController.createRequest
);

// Get request history
router.get('/requests', RecipientController.getRequestHistory);

// Update request urgency
router.patch(
  '/requests/:requestId/urgency',
  [
    param('requestId').isMongoId(),
    body('urgency').isIn(['Normal', 'Urgent', 'Critical']),
  ],
  RecipientController.updateRequestUrgency
);

// Cancel request
router.patch(
  '/requests/:requestId/cancel',
  [param('requestId').isMongoId()],
  RecipientController.cancelRequest
);

export default router;