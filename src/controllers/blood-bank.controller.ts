// Add to existing BloodBankController class

static async getDonorHistory(req: Request, res: Response) {
  try {
    const { donorId } = req.params;
    const donations = await Blood.find({ donorId })
      .sort({ createdAt: -1 })
      .populate('donorId', 'name bloodType');

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching donor history',
      error: error.message,
    });
  }
}

static async scheduleDonorAppointment(req: Request, res: Response) {
  try {
    const { donorId } = req.params;
    const { appointmentDate, bloodCenter } = req.body;

    const appointment = await DonationAppointment.create({
      donorId,
      appointmentDate,
      bloodCenter,
      status: 'Scheduled',
      scheduledBy: req.user._id
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