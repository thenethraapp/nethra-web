import { User, MapPin, Calendar, Shield, Star, MessageCircle, CheckCircle, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CloudinaryImage from '@/component/common/UI/CloudinaryImage';
import { ProfileData } from '@/types/domain/optometrist';

interface OverviewProps {
  profileData: ProfileData | null;
  isLoading?: boolean;
}

const Overview = ({ profileData, isLoading = false }: OverviewProps) => {
  const { user } = useAuth();

  const SkeletonLoader = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
  );

  if (isLoading) {
    return (
      <div className="space-y-6 min-h-screen bg-gray-50">
        {/* Profile Card Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <SkeletonLoader className="w-24 h-24 rounded-full" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <SkeletonLoader className="h-8 w-64" />
                <SkeletonLoader className="h-4 w-48" />
              </div>
              <div className="flex flex-wrap gap-3">
                <SkeletonLoader className="h-6 w-20 rounded-full" />
                <SkeletonLoader className="h-6 w-24 rounded-full" />
                <SkeletonLoader className="h-6 w-16 rounded-full" />
              </div>
              <div className="space-y-2">
                <SkeletonLoader className="h-4 w-32" />
                <SkeletonLoader className="h-16 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <SkeletonLoader className="h-5 w-20" />
                <SkeletonLoader className="h-4 w-4 rounded" />
              </div>
              <div className="space-y-3">
                <SkeletonLoader className="h-6 w-24" />
                <SkeletonLoader className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SkeletonLoader className="h-5 w-32 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <SkeletonLoader className="h-5 w-5 rounded" />
                  <SkeletonLoader className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Real data processing
  const ratings = profileData?.profile?.ratings || [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;
  const totalReviews = profileData?.profile?.reviews?.length || 0;

  const displayName = profileData?.user?.fullName || profileData?.user?.username || 'User';
  const displayLocation = profileData?.profile?.location || 'Location not specified';
  const displayExperience = profileData?.profile?.yearsOfExperience || 0;
  const displayExpertise = profileData?.profile?.expertise || [];
  const displayAbout = profileData?.profile?.about || 'About section not yet completed.';
  const badgeStatus = profileData?.profile?.badgeStatus || 'pending';
  const certificateType = profileData?.user?.certificateType || 'Certificate type not specified';
  const displayPhoto = profileData?.profile?.photo || '';

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen bg-gray-50 -m-3 sm:-m-4 lg:-m-6 p-3 sm:p-4 lg:p-6">

      {/* Doctor Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden ring-2 ring-[#0ab2e1] ring-offset-2">
              <CloudinaryImage
                src={displayPhoto}
                alt={displayName}
                width={96}
                height={96}
                fallbackSrc="/images/avatar.png"
              />
            </div>
          </div>

          <div className="flex-1 space-y-3 sm:space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl font-normal text-[#222222]">{displayName}</h1>
                {badgeStatus === 'verified' && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0ab2e1]/10 border border-[#0ab2e1]/20">
                    <CheckCircle className="h-3.5 w-3.5 text-[#0ab2e1]" />
                    <span className="text-xs font-medium text-[#0ab2e1]">Verified</span>
                  </div>
                )}
                {badgeStatus === 'pending' && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-yellow/5 border border-primary-yellow/30">
                    <Shield className="h-3.5 w-3.5 text-primary-yellow" />
                    <span className="text-xs font- text-primary-yellow">Pending Verification</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{certificateType}</p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#0ab2e1]" />
                  <span>{displayLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase size={14} className="text-[#0ab2e1]" />
                  <span>
                    {displayExperience > 0
                      ? `${displayExperience} years experience`
                      : 'Experience not specified'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield size={14} className="text-gray-400" />
                  <span className="text-xs">ID-{user?.id?.slice(0, 8) || 'N/A'}</span>
                </div>
              </div>
            </div>

            {displayExpertise.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayExpertise.map((expertise, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-cyan/5 text-primary-cyan border border-primary-cyan/10"
                  >
                    {expertise}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {displayAbout && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">About</h3>
            <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
              {displayAbout}
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ratings Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800">Rating</h3>
            <Star className="h-4 w-4 text-gray-400" />
          </div>

          <div className="space-y-3">
            {averageRating > 0 ? (
              <>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(averageRating)
                        ? 'text-[#facd0b] fill-[#facd0b]'
                        : 'text-gray-200'
                        }`}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-3xl font-light text-gray-800">{averageRating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    from {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-gray-200" />
                  ))}
                </div>
                <div>
                  <p className="text-3xl font-light text-gray-800">—</p>
                  <p className="text-xs text-gray-500 mt-1">No ratings yet</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reviews Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800">Reviews</h3>
            <MessageCircle className="h-4 w-4 text-gray-400" />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-3xl font-light text-gray-800">{totalReviews}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalReviews === 0
                  ? 'No reviews yet'
                  : totalReviews === 1
                    ? 'patient review'
                    : 'patient reviews'
                }
              </p>
            </div>
          </div>
        </div>

        {/* License Status Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800">License</h3>
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${badgeStatus === 'verified' ? 'bg-[#0ab2e1]' : 'bg-[#facd0b]'}`} />
                <span className="text-xs text-gray-500">Badge Status</span>
              </div>
              <p className="text-sm font-medium text-gray-800 capitalize">{badgeStatus}</p>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Certificate Type</p>
              <p className="text-sm text-gray-700">{certificateType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#0ab2e1]/30 hover:bg-[#0ab2e1]/5 transition-all">
            <User className="h-5 w-5 text-gray-400 group-hover:text-[#0ab2e1] transition-colors" />
            <span className="text-sm text-gray-700 group-hover:text-[#0ab2e1] transition-colors">Edit Profile</span>
          </button>

          <button className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#0ab2e1]/30 hover:bg-[#0ab2e1]/5 transition-all">
            <Calendar className="h-5 w-5 text-gray-400 group-hover:text-[#0ab2e1] transition-colors" />
            <span className="text-sm text-gray-700 group-hover:text-[#0ab2e1] transition-colors">View Bookings</span>
          </button>

          <button className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#0ab2e1]/30 hover:bg-[#0ab2e1]/5 transition-all">
            <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-[#0ab2e1] transition-colors" />
            <span className="text-sm text-gray-700 group-hover:text-[#0ab2e1] transition-colors">Messages</span>
          </button>

          <button className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#0ab2e1]/30 hover:bg-[#0ab2e1]/5 transition-all">
            <Shield className="h-5 w-5 text-gray-400 group-hover:text-[#0ab2e1] transition-colors" />
            <span className="text-sm text-gray-700 group-hover:text-[#0ab2e1] transition-colors">Verify Badge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;