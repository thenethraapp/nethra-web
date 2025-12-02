export interface Conversation {
    _id: string;
    participants: Array<{
      userId: {
        _id: string;
        firstName?: string;
        lastName?: string;
        fullName?: string;
        username?: string;
        profilePicture?: string;
        photo?: string; // Profile photo from OptometristProfile or PatientProfile
        role: 'patient' | 'optometrist';
      };
      userType: 'patient' | 'optometrist';
      joinedAt: string;
    }>;
    lastMessage?: {
      _id: string;
      content: {
        text: string;
      };
      sender: {
        userId: string;
        userType: string;
      };
      createdAt: string;
    };
    lastMessageAt: string;
    unreadCount: number;
    metadata?: {
      appointmentId?: string;
      consultationType?: 'general' | 'followup' | 'emergency' | 'prescription';
    };
  }
  

  