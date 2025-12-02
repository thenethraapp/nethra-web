export interface User {
    fullName: string;
    certificateType?: string;
  }
  
  export interface Profile {
    expertise?: string[];
    location?: string;
  }
  
  export interface Optometrist {
    user: User;
    profile?: Profile | null;
  }
  
  export interface DropdownOption {
    value: string;
    label: string;
  }