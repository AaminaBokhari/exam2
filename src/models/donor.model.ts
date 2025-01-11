import mongoose from 'mongoose';
import { IDonor } from '../types';

const donorSchema = new mongoose.Schema<IDonor>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodType: { type: String, required: true },
  lastDonationDate: { type: Date },
  donationCount: { type: Number, default: 0 },
  healthStatus: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Donor = mongoose.model<IDonor>('Donor', donorSchema);