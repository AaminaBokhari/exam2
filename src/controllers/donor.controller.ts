import { Request, Response } from 'express';
import { Donor } from '../models/donor.model';
import { Blood } from '../models/blood.model';

export class DonorController {
  // Record a new donation
  static async recordDonation(req: Request, res: Response) {
    try {
      const { bloodType, units, healthCheck } = req.body;
      const donorId = req.user._id; // From auth middleware

      // Check eligibility based on health check
      const isEligible = DonorController.checkEligibility(healthCheck);
      if (!isEligible) {
        return res.status(400).json({
          message: 'Donor is not eligible for donation at this time',
        });
      }

      // Create blood record
      const bloodRecord = await Blood.create({
        donorId,
        bloodType,
        units,
        status: 'Available',
        expiryDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 42 days expiry
      });

      // Update donor's last donation date and count
      await Donor.findOneAndUpdate(
        { userId: donorId },
        {
          $set: { lastDonationDate: new Date() },
          $inc: { donationCount: 1 },
        }
      );

      res.status(201).json({
        message: 'Donation recorded successfully',
        bloodRecord,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error recording donation',
        error: error.message,
      });
    }
  }

  // View donation history
  static async getDonationHistory(req: Request, res: Response) {
    try {
      const donorId = req.user._id;
      const donations = await Blood.find({ donorId }).sort({ createdAt: -1 });
      
      res.status(200).json(donations);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching donation history',
        error: error.message,
      });
    }
  }

  // Check eligibility
  static async checkEligibility(req: Request, res: Response) {
    try {
      const donorId = req.user._id;
      const donor = await Donor.findOne({ userId: donorId });

      if (!donor) {
        return res.status(404).json({
          message: 'Donor not found',
        });
      }

      // Check last donation date (minimum 56 days between donations)
      const lastDonation = donor.lastDonationDate;
      const minDays = 56;
      const isEligibleByDate = !lastDonation || 
        (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24) >= minDays;

      res.status(200).json({
        isEligible: isEligibleByDate && donor.healthStatus === 'Eligible',
        nextEligibleDate: lastDonation ? 
          new Date(lastDonation.getTime() + minDays * 24 * 60 * 60 * 1000) : 
          new Date(),
        healthStatus: donor.healthStatus,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error checking eligibility',
        error: error.message,
      });
    }
  }

  // Update health status
  static async updateHealthStatus(req: Request, res: Response) {
    try {
      const donorId = req.user._id;
      const { healthStatus } = req.body;

      const donor = await Donor.findOneAndUpdate(
        { userId: donorId },
        { healthStatus },
        { new: true }
      );

      if (!donor) {
        return res.status(404).json({
          message: 'Donor not found',
        });
      }

      res.status(200).json({
        message: 'Health status updated successfully',
        donor,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating health status',
        error: error.message,
      });
    }
  }

  // Helper method to check eligibility based on health check
  private static checkEligibility(healthCheck: any): boolean {
    const {
      hemoglobin,
      bloodPressure,
      weight,
      temperature,
      lastMeal,
    } = healthCheck;

    // Minimum requirements for donation
    const minHemoglobin = 12.5; // g/dL
    const minWeight = 50; // kg
    const maxTemperature = 37.5; // °C
    const minHoursSinceLastMeal = 4;

    // Parse blood pressure
    const [systolic, diastolic] = bloodPressure.split('/').map(Number);
    const isBloodPressureNormal = 
      systolic >= 90 && systolic <= 180 && 
      diastolic >= 60 && diastolic <= 100;

    const hoursSinceLastMeal = 
      (Date.now() - new Date(lastMeal).getTime()) / (1000 * 60 * 60);

    return (
      hemoglobin >= minHemoglobin &&
      weight >= minWeight &&
      temperature <= maxTemperature &&
      isBloodPressureNormal &&
      hoursSinceLastMeal >= minHoursSinceLastMeal
    );
  }
}