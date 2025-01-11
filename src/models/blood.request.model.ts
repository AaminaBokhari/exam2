import mongoose from 'mongoose';
import { IBloodRequest } from '../types';

const bloodRequestSchema = new mongoose.Schema<IBloodRequest>({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient',
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  units: {
    type: Number,
    required: true,
    min: 1,
  },
  urgency: {
    type: String,
    required: true,
    enum: ['Normal', 'Urgent', 'Critical'],
    default: 'Normal',
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending',
  },
  hospitalName: {
    type: String,
    required: true,
  },
  diagnosisDetails: {
    type: String,
    required: true,
  },
  requiredDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const BloodRequest = mongoose.model<IBloodRequest>('BloodRequest', bloodRequestSchema);