import { useQuery } from '@tanstack/react-query';
import { HiCalendar, HiDocumentText, HiUsers } from 'react-icons/hi';
import { StatCard, DashboardGrid, GridCard } from '@/component/features/dashboard';
import { ProfileData } from '@/types/domain/optometrist';
import { getAllOptometristBookings } from '@/api/booking/optometrist/get-all-optometrist-bookings';
import { getAllRecords } from '@/api/records';
import CloudinaryImage from '@/component/common/UI/CloudinaryImage';
import { CheckCircle, Shield, MapPin, Briefcase, Star } from 'lucide-react';

interface OverviewProps {
  profileData: ProfileData | null;
  isLoading?: boolean;
}

const Overview = ({ profileData, isLoading = false }: OverviewProps) => {
  // Fetch optometrist bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['optometrist-bookings'],
    queryFn: getAllOptometristBookings,
  });

  // Fetch patient records
  const { data: recordsData, isLoading: recordsLoading } = useQuery({
    queryKey: ['optometrist-records'],
    queryFn: () => getAllRecords({ page: 1, limit: 1 }),
  });

  // Calculate statistics
  const totalBookings = bookingsData?.data?.length || 0;
  const totalRecords = recordsData?.pagination?.total || 0;
  const pendingBookings = bookingsData?.data?.filter(
    (booking: { status: string }) => booking.status === 'pending'
  ).length || 0;
  const upcomingBookings = bookingsData?.data?.filter((booking: { status: string; appointmentDate: string }) => {
    if (booking.status !== 'accepted') return false;
    const appointmentDate = new Date(booking.appointmentDate);
    return appointmentDate >= new Date();
  }).length || 0;

  // Profile data processing
  const ratings = profileData?.profile?.ratings || [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
    : 0;
  const totalReviews = profileData?.profile?.reviews?.length || 0;

  const displayName = profileData?.user?.fullName || profileData?.user?.username || 'Optometrist';
  const displayLocation = profileData?.profile?.location || 'Location not specified';
  const displayExperience = profileData?.profile?.yearsOfExperience || 0;
  const displayExpertise = profileData?.profile?.expertise || [];
  const displayAbout = profileData?.profile?.about || 'About section not yet completed.';
  const badgeStatus = profileData?.profile?.badgeStatus || 'pending';
  const certificateType = profileData?.user?.certificateType || 'Certificate type not specified';
  const displayPhoto = profileData?.profile?.photo || '';

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-pulse">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-64" />
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
          </div>
        </div>
        <DashboardGrid columns={4} gap="md">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-[200px] animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4" />
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </DashboardGrid>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden ring-2 ring-primary-cyan ring-offset-2">
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
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{displayName}</h1>
                {badgeStatus === 'verified' && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-cyan/10 border border-primary-cyan/20">
                    <CheckCircle className="h-3.5 w-3.5 text-primary-cyan" />
                    <span className="text-xs font-medium text-primary-cyan">Verified</span>
                  </div>
                )}
                {badgeStatus === 'pending' && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-yellow/5 border border-primary-yellow/30">
                    <Shield className="h-3.5 w-3.5 text-primary-yellow" />
                    <span className="text-xs font-medium text-primary-yellow">Pending Verification</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{certificateType}</p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary-cyan" />
                  <span>{displayLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase size={14} className="text-primary-cyan" />
                  <span>
                    {displayExperience > 0
                      ? `${displayExperience} years experience`
                      : 'Experience not specified'}
                  </span>
                </div>
              </div>
            </div>

            {displayExpertise.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayExpertise.map((expertise: string, index: number) => (
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
      <DashboardGrid columns={4} gap="md">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={HiCalendar}
          variant="primary"
          loading={bookingsLoading}
          hasSpinningBorder={false}
        />
        <StatCard
          title="Pending Bookings"
          value={pendingBookings}
          icon={HiCalendar}
          loading={bookingsLoading}
        />
        <StatCard
          title="Patient Records"
          value={totalRecords}
          icon={HiDocumentText}
          loading={recordsLoading}
        />
        <StatCard
          title="Average Rating"
          value={averageRating > 0 ? averageRating.toFixed(1) : '—'}
          icon={Star}
        />
      </DashboardGrid>

      {/* Quick Actions */}
      <DashboardGrid columns={2} gap="md">
        <GridCard height="h-[300px]" colSpan={1}>
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <button
                onClick={() => window.location.href = '/dashboard/optometrist?tab=bookings'}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-cyan hover:bg-primary-cyan/5 transition-all group"
              >
                <HiCalendar className="w-8 h-8 text-gray-400 group-hover:text-primary-cyan mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-cyan transition-colors">
                  View Bookings
                </span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/optometrist?tab=patient_records'}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-cyan hover:bg-primary-cyan/5 transition-all group"
              >
                <HiDocumentText className="w-8 h-8 text-gray-400 group-hover:text-primary-cyan mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-cyan transition-colors">
                  Patient Records
                </span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/optometrist?tab=profile'}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-cyan hover:bg-primary-cyan/5 transition-all group"
              >
                <HiUsers className="w-8 h-8 text-gray-400 group-hover:text-primary-cyan mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-cyan transition-colors">
                  Edit Profile
                </span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/optometrist?tab=overview'}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-cyan hover:bg-primary-cyan/5 transition-all group"
              >
                <Star className="w-8 h-8 text-gray-400 group-hover:text-primary-cyan mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-cyan transition-colors">
                  Reviews ({totalReviews})
                </span>
              </button>
            </div>
          </div>
        </GridCard>

        <GridCard height="h-[300px]" colSpan={1}>
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
            <div className="flex-1 flex flex-col gap-3">
              {upcomingBookings > 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary-cyan mb-2">{upcomingBookings}</p>
                    <p className="text-sm text-gray-600">Upcoming appointments this week</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p className="text-sm">No upcoming appointments</p>
                </div>
              )}
            </div>
          </div>
        </GridCard>
      </DashboardGrid>
    </section>
  );
};

export default Overview;
