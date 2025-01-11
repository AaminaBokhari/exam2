import { Request, Response } from 'express';
import { BloodRequest } from '../models/blood.request.model';
import { Recipient } from '../models/recipient.model';

export class RecipientController {
  // Create a blood request
  static async createRequest(req: Request, res: Response) {
    try {
      const {
        bloodType,
        units,
        urgency,
        hospitalName,
        diagnosisDetails,
        requiredDate,
      } = req.body;
      const recipientId = req.user._id;

      const bloodRequest = await BloodRequest.create({
        recipientId,
        bloodType,
        units,
        urgency,
        hospitalName,
        diagnosisDetails,
        requiredDate: new Date(requiredDate),
      });

      if (urgency === 'Critical') {
        await Recipient.findOneAndUpdate(
          { userId: recipientId },
          { $inc: { emergencyCount: 1 } }
        );
      }

      res.status(201).json({
        message: 'Blood request created successfully',
        request: bloodRequest,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating blood request',
        error: error.message,
      });
    }
  }

  // Get request history
  static async getRequestHistory(req: Request, res: Response) {
    try {
      const recipientId = req.user._id;
      const requests = await BloodRequest.find({ recipientId })
        .sort({ createdAt: -1 });

      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching request history',
        error: error.message,
      });
    }
  }

  // Update request urgency
  static async updateRequestUrgency(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const { urgency } = req.body;
      const recipientId = req.user._id;

      const request = await BloodRequest.findOne({
        _id: requestId,
        recipientId,
      });

      if (!request) {
        return res.status(404).json({
          message: 'Blood request not found',
        });
      }

      if (request.status !== 'Pending') {
        return res.status(400).json({
          message: 'Cannot update urgency of non-pending request',
        });
      }

      const updatedRequest = await BloodRequest.findByIdAndUpdate(
        requestId,
        { urgency },
        { new: true }
      );

      if (urgency === 'Critical' && request.urgency !== 'Critical') {
        await Recipient.findOneAndUpdate(
          { userId: recipientId },
          { $inc: { emergencyCount: 1 } }
        );
      }

      res.status(200).json({
        message: 'Request urgency updated successfully',
        request: updatedRequest,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating request urgency',
        error: error.message,
      });
    }
  }

  // Cancel blood request
  static async cancelRequest(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const recipientId = req.user._id;

      const request = await BloodRequest.findOne({
        _id: requestId,
        recipientId,
      });

      if (!request) {
        return res.status(404).json({
          message: 'Blood request not found',
        });
      }

      if (request.status !== 'Pending') {
        return res.status(400).json({
          message: 'Cannot cancel non-pending request',
        });
      }

      const updatedRequest = await BloodRequest.findByIdAndUpdate(
        requestId,
        { status: 'Rejected' },
        { new: true }
      );

      res.status(200).json({
        message: 'Request cancelled successfully',
        request: updatedRequest,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error cancelling request',
        error: error.message,
      });
    }
  }
}