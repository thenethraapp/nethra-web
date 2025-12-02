export interface ProfileData {
    user: {
      id: string;
      email: string;
      phone: string;
      role: string;
      fullName?: string;
      certificateType?: string;
      idNumber?: string;
      expiryDate?: string;
      username?: string;
      createdAt: string;
      updatedAt: string;
    };
    profile: {
      _id: string;
      user: string;
      photo?: string;
      about?: string;
      badgeStatus?: string;
      location: string;
      expertise?: string[];
      yearsOfExperience?: number;
      ratings?: [];
      reviews?: [];
      profilePhoto?: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  }

  export interface User {
    id: string;
    email: string;
    phone: string;
    role: 'patient' | 'optometrist';
    fullName?: string;
    username?: string;
    certificateType?: string;
    idNumber?: string;
    expiryDate?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PatientProfile {
    _id: string;
    user: string;
    location: string;
    profilePhoto: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface OptometristProfile {
    _id: string;
    user: string;
    photo: string;
    about: string;
    badgeStatus: string;
    location: string;
    expertise: string[];
    yearsOfExperience: number;
    ratings: number[];
    reviews: [];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface UserProfileData {
    user: User;
    profile: PatientProfile | OptometristProfile | null;
  }