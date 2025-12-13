import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/api/profile/getUserProfile';
import Link from 'next/link';
import { BadgeCheck, Star, Calendar, Briefcase, Video } from 'lucide-react';
import WheelLoader from '@/component/common/UI/WheelLoader';
import Image from 'next/image';
import { useRouter } from 'next/router';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { createImmediateBooking } from '@/api/booking';
import { toast } from 'sonner';

interface ProfileResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      fullName?: string;
      username?: string;
      email?: string;
      phone?: string;
      role: string;
      certificateType?: string;
      createdAt?: string;
      idNumber?: string;
    };
    profile: {
      photo?: string;
      location?: string;
      yearsOfExperience?: number;
      expertise?: string[];
      about?: string;
      badgeStatus?: string;
      ratings?: number[];
      reviews?: unknown[];
    };
  };
  message?: string;
  code?: number;
}

const ProfileDoc = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { userId } = router.query;
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get userId from URL query parameter (persistent across refreshes)
        // Fallback to sessionStorage for backward compatibility
        // Then fallback to current user if viewing own profile
        let targetUserId: string | null = null;

        if (userId && typeof userId === 'string') {
          targetUserId = userId;
        } else if (typeof window !== 'undefined') {
          // Backward compatibility: check sessionStorage
          targetUserId = sessionStorage.getItem('profileUserId');
          // Clear sessionStorage after reading (migration to URL params)
          if (targetUserId) {
            sessionStorage.removeItem('profileUserId');
          }
        }

        // Only use current user as fallback if we're viewing our own profile
        if (!targetUserId) {
          targetUserId = user?.id || null;
        }

        if (!targetUserId) {
          setError('User not found');
          setLoading(false);
          return;
        }

        const data = await getUserProfile(targetUserId);
        if (data.success && data.data) {
          setProfileData(data as ProfileResponse);
        } else {
          setError(data.message || 'Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    // Wait for router to be ready before fetching
    // This ensures query params are available
    if (!router.isReady) {
      return;
    }

    fetchProfileData();
  }, [userId, user?.id, router.isReady]);

  if (loading) {
    return <WheelLoader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!profileData?.data || !profileData.success) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Profile not found</div>
      </div>
    );
  }

  const profile = profileData.data!;
  const isOwnProfile = profile.user.id === user?.id;
  const isOptometrist = profile.user.role === 'optometrist';

  // Calculate ratings
  const ratings = profile?.profile?.ratings || [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
    : 0;
  const totalReviews = profile?.profile?.reviews?.length || 0;

  const displayName = profile?.user?.fullName || profile?.user?.username || 'User';
  const displayLocation = profile?.profile?.location || 'Not specified';
  const displayExperience = profile?.profile?.yearsOfExperience || 0;
  const displayExpertise = profile?.profile?.expertise || [];
  const badgeStatus = profile?.profile?.badgeStatus || 'pending';
  const certificateType = profile?.user?.certificateType || 'N/A';
  const displayPhoto = profile?.profile?.photo || '';

  // Format joined date
  const joinedDate = profile?.user?.createdAt
    ? new Date(profile.user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    : 'N/A';

  // Book Right Now Button Component
  const BookRightNowButton = ({ optometristId }: { optometristId: string }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleBookRightNow = async () => {
      if (!user || user.role !== 'patient') {
        toast.error('Only patients can book consultations');
        return;
      }

      setIsLoading(true);
      const loadingToast = toast.loading('Creating immediate consultation...');

      try {
        const response = await createImmediateBooking(optometristId);

        if (response.success) {
          toast.dismiss(loadingToast);
          toast.success('Consultation Ready!', {
            description: 'Check your notifications to join the consultation.',
            duration: 5000,
          });
        } else {
          toast.dismiss(loadingToast);
          toast.error('Failed to create consultation', {
            description: response.message || 'Please try again.',
            duration: 5000,
          });
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('Error', {
          description: 'Failed to create immediate consultation. Please try again.',
          duration: 5000,
        });
        console.error('Error creating immediate booking:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <button
        onClick={handleBookRightNow}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${isLoading
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </>
        ) : (
          <>
            <Video className="w-5 h-5" />
            Book Right Now (Testing)
          </>
        )}
      </button>
    );
  };



  return (
    <div className="bg-gray-100 relative overflow-hidden pb-24">

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden w-full max-w-5xl mx-auto">
          <div className="px-6 lg:px-8 pt-6 lg:pt-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 lg:w-64 lg:h-64 mx-auto lg:mx-0">
                  {displayPhoto ? (
                    <Image
                      src={displayPhoto}
                      alt={displayName}
                      fill
                      className="rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-cyan to-primary-blue flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1 min-w-0">
                {/* Name and Qualifications */}
                <div className="mb-4">
                  <h2 className="text-2xl lg:text-3xl font-semibold text-primary-blue mb-2">
                    Dr. {displayName}
                  </h2>
                  <p className="text-lg font-medium text-gray-800 mb-1">
                    {certificateType}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {
                      displayExpertise.length > 0 && displayExpertise.map((expertise: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-cyan/5 text-primary-cyan border border-primary-cyan/10">
                          {expertise}
                        </span>
                      ))
                    }
                  </div>
                </div>

                {/* Working At */}
                <div className="mb-4">
                  <div className="flex items-start gap-2">
                    <LocationPinIcon className="text-[#4FD9B3] text-base" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Location</p>
                      <p className="text-sm lg:text-base text-gray-800">
                        {displayLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consultation Fee - Placeholder for future implementation */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-0.5">Consultation Fee</p>
                  <p className="text-lg font-semibold text-primary-blue">
                    Available on request
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Per consultation</p>
                </div>

                {/* Professional Statistics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total Experience */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Total Experience</p>
                    <p className="text-lg font-medium text-gray-600">
                      {displayExperience || 0}+ Years
                    </p>
                  </div>

                  {/* Certificate Number */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">License ID</p>
                    <p className="text-lg font-medium text-gray-600">
                      {profile.user.idNumber
                        ? `${profile.user.idNumber.substring(0, 5)}${'*'.repeat(profile.user.idNumber.length > 5 ? profile.user.idNumber.length - 5 : 0)}`
                        : 'N/A'}
                    </p>
                  </div>

                  {/* Joined Date */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Joined Nethra</p>
                    <p className="text-lg font-medium text-gray-600">
                      {joinedDate}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Total Rating {totalReviews > 0 && `(${totalReviews})`}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <p className="text-lg font-medium text-gray-600">
                        {averageRating > 0 ? averageRating.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='w-full pb-6 space-y-3'>
                  {isOptometrist && !isOwnProfile && (
                    <>
                      <BookRightNowButton optometristId={profile.user.id} />
                      <Link
                        href={`/booking?optometristId=${profile.user.id}`}
                        className='w-full bg-primary-cyan flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold transition-all duration-200 hover:bg-primary-cyan/90'
                      >
                        <Calendar className="w-5 h-5" />
                        Book Appointment Now
                      </Link>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDoc;