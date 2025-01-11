export interface IBloodRequest {
  recipientId: string;
  bloodType: string;
  units: number;
  urgency: 'Normal' | 'Urgent' | 'Critical';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  hospitalName: string;
  diagnosisDetails: string;
  requiredDate: Date;
  createdAt: Date;
}

export interface IRecipient {
  userId: string;
  bloodType: string;
  diagnosisId: string;
  hospitalName: string;
  emergencyCount: number;
  createdAt: Date;
}