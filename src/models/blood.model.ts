import mongoose from 'mongoose';
import { IBlood, BloodStatus } from '../types';

const bloodSchema = new mongoose.Schema<IBlood>({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient' },
  bloodType: { type: String, required: true },
  units: { type: Number, required: true },
  status: { 
    type: String, 
    enum: Object.values(BloodStatus),
    default: BloodStatus.AVAILABLE 
  },
  expiryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Blood = mongoose.model<IBlood>('Blood', bloodSchema);