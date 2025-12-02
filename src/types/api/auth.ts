export interface User {
    id: string;
    email: string;
    role: 'patient' | 'optometrist';
}

export interface PatientInfo {
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export interface BasicInfo {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export interface Credentials {
    certificateType: string;
    idNumber: string;
    expiryDate: string;
}

export interface IPData {
    ip: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    timezone: string;
}

export type Step = 'email' | 'otp' | 'password' | 'success';

export interface RequestEmailFormProps {
  onSuccess: (email: string) => void;
}

export interface VerifyOTPFormProps {
  email: string;
  onSuccess: (otp: string) => void;
  onBack: () => void;
}

export interface SetPasswordFormProps {
  email: string;
  otp: string;
  onSuccess: () => void;
  onBack: () => void;
}

export interface SuccessMessageProps {
  onBackToLogin: () => void;
}