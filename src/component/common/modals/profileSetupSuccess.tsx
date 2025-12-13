import { Check } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const ProfileSetupSuccess = ({ onClose: _onClose }: {
  onClose: () => void
}) => {

  const router = useRouter();
  const { user } = useAuth();

  // Check if user came from booking page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fromBooking = sessionStorage.getItem('fromBooking');
      if (fromBooking === 'true' && user?.hasCompletedProfile) {
        // Clear the flag
        sessionStorage.removeItem('fromBooking');
        // Small delay to show success message, then redirect
        setTimeout(() => {
          router.push('/booking');
        }, 2000);
      }
    }
  }, [user, router]);

  const handleBackToBooking = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('fromBooking');
    }
    router.push('/booking');
  };

  const handleGoToFeed = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('fromBooking');
    }
    router.push('/feed');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-6">
      <div className="bg-white p-6 pt-12 rounded-3xl w-full max-w-100 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto bg-primary-cyan rounded-full flex items-center justify-center">
            <Check className="w-16 h-16 text-white" strokeWidth={3} />
          </div>
        </div>

        <h1 className="font-bold text-charcoal mb-4 w-full max-w- mx-auto">
          Your Profile has been created successfully!
        </h1>

        <div className="grid grid-cols-1 gap-2 mt-12">
          <button onClick={handleBackToBooking} className="cursor-pointer py-4 bg-primary-cyan hover:bg-primary-cyan/70 text-white rounded-full font-medium text-sm hover:bg-opacity-90 transition-all">
            Continue to Booking
          </button>
          <button onClick={handleGoToFeed} className="cursor-pointer  py-2 border-2 border-primary-cyan text-primary-cyan rounded-full font-medium text-sm hover:bg-lightlavender transition-all">
            Go to Feed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupSuccess