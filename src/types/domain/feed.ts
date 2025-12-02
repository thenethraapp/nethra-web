export interface User {
    id: string;
    fullName: string;
    certificateType: string;
    photo?: string;
  }
  
  export interface Profile {
    photo?: string;
    location?: string;
    about?: string;
    expertise?: string[];
  }
  
  export interface Optometrist {
    user: User;
    profile?: Profile;
  }
  
  
  
  export interface StarRatingProps {
    rating?: number;
  }
  
  export interface ExpertiseChipProps {
    expertise: string;
  }
  
  export interface OptometristsFeedProps {
    optometrists: Optometrist[];
    isLoading: boolean;
    isError: boolean;
    error?: string;
  }
  
  export interface ProfileCardProps {
    optometrist: Optometrist;
    onViewProfile: (userId: string) => void;
  }
  
  export interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
  }