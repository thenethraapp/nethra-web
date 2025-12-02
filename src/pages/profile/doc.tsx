import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/api/profile/getUserProfile';
import Link from 'next/link';
import { BadgeCheck, Star, Calendar } from 'lucide-react';
import WheelLoader from '@/component/common/UI/WheelLoader';
import Image from 'next/image';

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
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get userId from sessionStorage (state-based navigation)
        let targetUserId: string | null = null;
        if (typeof window !== 'undefined') {
          targetUserId = sessionStorage.getItem('profileUserId');
        }

        // Only use current user as fallback if we're viewing our own profile
        // If sessionStorage has a userId, use it (even if it's the same as current user)
        if (!targetUserId) {
          // Only fallback to current user if no userId in sessionStorage
          targetUserId = user?.id || null;
        }

        if (!targetUserId) {
          setError('User not found');
          return;
        }

        const data = await getUserProfile(targetUserId);
        if (data.success && data.data) {
          setProfileData(data as ProfileResponse);
          // Clear sessionStorage only after successful fetch
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('profileUserId');
          }
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

    fetchProfileData();
    // Only run once on mount, not when user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <WheelLoader />
    );
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

  // TypeScript guard: we've already checked data exists above
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
  const displayEmail = profile?.user?.email || '';
  const displayPhone = profile?.user?.phone || '';
  const displayLocation = profile?.profile?.location || 'Not specified';
  const displayExperience = profile?.profile?.yearsOfExperience || 0;
  const displayExpertise = profile?.profile?.expertise || [];
  const displayAbout = profile?.profile?.about || 'Tell your patients about yourself';
  const badgeStatus = profile?.profile?.badgeStatus || 'pending';
  const certificateType = profile?.user?.certificateType || 'N/A';
  const displayPhoto = profile?.profile?.photo || '';

  return (
    <div className="min-h-screen relative bg-gray-50">
      <div className="w-full mx-auto space-y-6 pb-30 px-4 sm:px-6 py-6">
        {/* Profile Header Card */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                {displayPhoto ? (
                  <Image
                    src={displayPhoto}
                    alt="Profile"
                    width={60}
                    height={60}
                    className="w-15 h-15 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary-cyan"
                  />
                ) : (
                  <Image
                    src="/icons/avatar.png"
                    alt="Profile"
                    width={60}
                    height={60}
                    className="w-15 h-15 sm:w-20 sm:h-20 rounded-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{displayName}</h1>
                <p className="text-gray-500 text-sm mt-1 capitalize">{profile?.user?.role}</p>
              </div>
            </div>
            {/* Book Appointment Button - only show if not own profile and is optometrist */}
            {isOptometrist && !isOwnProfile && (
              <Link
                className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-cyan hover:bg-primary-darkcyan cursor-pointer rounded-full text-white font-medium transition-all text-sm shadow-md hover:shadow-lg w-full sm:w-auto"
                href={`/booking?optometristId=${profile.user.id}`}
              >
                <Calendar size={16} />
                <span className="truncate">Book Appointment</span>
              </Link>
            )}
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between items-center border-none outline-none p-2 rounded-md">
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Your Name</p>
                <p className="font-medium">{displayName}</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-none outline-none p-2 rounded-md">
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Email</p>
                <p className="font-medium">{displayEmail}</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-none outline-none p-2 rounded-md">
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Phone Number</p>
                <p className="font-medium">{displayPhone}</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-none outline-none p-2 rounded-md">
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Location</p>
                <p className="font-medium">{displayLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">
              About <span className="text-primary-cyan">{displayName}</span>
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {displayAbout}
          </p>
        </div>

        {/* Professional Details Card */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-primary-cyan" />
              <p className="text-sm text-gray-500">Professional details shown to users</p>
            </div>
          </div>

          {/* Expertise Section */}
          <div>
            <p className="font-medium mb-2">Expertise In</p>
            <div className="flex flex-wrap gap-2">
              {displayExpertise.length > 0 ? (
                displayExpertise.map((expertise: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {expertise}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No expertise added yet</span>
              )}
            </div>
          </div>

          {/* Years of Experience */}
          <div>
            <p className="font-medium mb-2">Total Experience</p>
            <div className="bg-gray-50 rounded-md p-3 flex justify-between items-center shadow-inner">
              <span className="text-gray-800 font-semibold">
                {displayExperience || 0} Years
              </span>
              <span className="text-gray-500 text-sm">of total experience</span>
            </div>
          </div>

          {/* Ratings */}
          <div>
            <p className="font-medium mb-2">Ratings</p>
            <div className="bg-blue-100 text-primary-cyan rounded-md p-3 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">
                  {averageRating > 0 ? `${averageRating.toFixed(1)} Stars` : 'No ratings yet'}
                </span>
              </div>
              <span className="text-sm text-primary-cyan">
                {totalReviews > 0 ? `from ${totalReviews} users` : 'No reviews yet'}
              </span>
            </div>
          </div>
        </div>

        {/* Legal Section */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Legal</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Badge Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeStatus === 'verified'
                ? 'bg-green-100 text-green-600'
                : 'bg-yellow-100 text-yellow-600'
                }`}>
                {badgeStatus === 'verified' ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Certificate Type</span>
              <span className="text-gray-600">{certificateType}</span>
            </div>
          </div>
        </div>

        {/* Book Appointment Button - Show for optometrist profiles when not viewing own profile */}
        {isOptometrist && !isOwnProfile && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Ready to Book?</h3>
                <p className="text-sm text-gray-600">Schedule an appointment with {displayName}</p>
              </div>
              <Link
                className='inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-cyan hover:bg-primary-darkcyan cursor-pointer rounded-full text-white font-medium transition-all shadow-md hover:shadow-lg'
                href={`/booking?optometristId=${profile.user.id}`}>
                <Calendar size={18} />
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDoc;

