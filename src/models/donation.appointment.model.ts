import mongoose from 'mongoose';

const donationAppointmentSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  bloodCenter: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const DonationAppointment = mongoose.model('DonationAppointment', donationAppointmentSchema);