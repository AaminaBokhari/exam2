// ... existing imports ...

export class DonorController {
  // ... existing methods ...

  static async scheduleDonation(req: Request, res: Response) {
    try {
      const { appointmentDate, bloodCenter } = req.body;
      const donorId = req.user._id;

      const appointment = await DonationAppointment.create({
        donorId,
        appointmentDate,
        bloodCenter,
        status: 'Scheduled'
      });

      res.status(201).json({
        message: 'Donation appointment scheduled successfully',
        appointment
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error scheduling donation',
        error: error.message
      });
    }
  }

  static async getCertificate(req: Request, res: Response) {
    try {
      const donorId = req.user._id;
      const { donationId } = req.params;

      const donation = await Blood.findOne({
        _id: donationId,
        donorId,
        status: 'Completed'
      });

      if (!donation) {
        return res.status(404).json({
          message: 'Donation record not found'
        });
      }

      // Generate certificate data
      const certificateData = {
        donorName: req.user.name,
        donationDate: donation.createdAt,
        bloodType: donation.bloodType,
        units: donation.units,
        certificateId: `CERT-${donation._id}`
      };

      res.status(200).json(certificateData);
    } catch (error) {
      res.status(500).json({
        message: 'Error generating certificate',
        error: error.message
      });
    }
  }
}