import mongoose from 'mongoose';
import { IRecipient } from '../types';

const recipientSchema = new mongoose.Schema<IRecipient>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodType: { type: String, required: true },
  diagnosisId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  emergencyCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Recipient = mongoose.model<IRecipient>('Recipient', recipientSchema);