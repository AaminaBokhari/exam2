import { Request, Response } from 'express';
import { Blood } from '../models/blood.model';
import { BloodRequest } from '../models/blood.request.model';

export class BloodBankController {
  // View blood inventory
  static async getInventory(req: Request, res: Response) {
    try {
      const inventory = await Blood.find({ status: 'Available' })
        .sort({ expiryDate: 1 });

      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching blood inventory',
        error: error.message,
      });
    }
  }

  // Add to blood inventory
  static async addToInventory(req: Request, res: Response) {
    try {
      const { bloodType, units, donorId } = req.body;

      const blood = await Blood.create({
        donorId,
        bloodType,
        units,
        status: 'Available',
        expiryDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 42 days expiry
      });

      res.status(201).json({
        message: 'Blood added to inventory successfully',
        blood,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error adding blood to inventory',
        error: error.message,
      });
    }
  }

  // View all blood requests
  static async getAllRequests(req: Request, res: Response) {
    try {
      const requests = await BloodRequest.find()
        .sort({ urgency: -1, createdAt: -1 })
        .populate('recipientId', 'hospitalName');

      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching blood requests',
        error: error.message,
      });
    }
  }

  // Process a blood request
  static async processRequest(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const { status, bloodId } = req.body;

      const request = await BloodRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({
          message: 'Blood request not found',
        });
      }

      if (status === 'Approved' && !bloodId) {
        return res.status(400).json({
          message: 'Blood ID is required for approval',
        });
      }

      if (status === 'Approved') {
        const blood = await Blood.findById(bloodId);
        if (!blood || blood.status !== 'Available') {
          return res.status(400).json({
            message: 'Invalid or unavailable blood unit',
          });
        }

        await Blood.findByIdAndUpdate(bloodId, {
          status: 'Allocated',
          recipientId: request.recipientId,
        });
      }

      const updatedRequest = await BloodRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      );

      res.status(200).json({
        message: 'Request processed successfully',
        request: updatedRequest,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error processing request',
        error: error.message,
      });
    }
  }
}