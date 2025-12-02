export interface ProfileData {
  user: {
    id: string;
    fullName?: string;
    username?: string;
    email?: string;
    phone?: string;
    role: string;
    certificateType?: string;
    idNumber?: string;
    expiryDate?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  profile: {
    photo?: string;
    about?: string;
    location?: string;
    expertise?: string[];
    yearsOfExperience?: number;
    badgeStatus?: string;
    ratings?: number[];
    reviews?: [];
    createdAt: string;
    updatedAt: string;
    __v: number;
  } | null;
}