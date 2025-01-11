export interface IUser {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phoneNumber: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
}

export enum UserRole {
  DONOR = 'Donor',
  RECIPIENT = 'Recipient',
  STAFF = 'Staff'
}

// ... rest of the types ...