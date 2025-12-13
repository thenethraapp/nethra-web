import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiCalendar, HiDocumentText, HiShoppingBag } from 'react-icons/hi';
import { FaStarOfLife } from 'react-icons/fa6';
import { StatCard, DashboardGrid, GridCard } from '@/component/features/dashboard';
import { getPatientBookings } from '@/api/booking/patient/get-patient-bookings';
import { getAllRecords } from '@/api/records';
import { getPatientProfile } from '@/api/profile/patient/get-patient-profile';
import { useAuth } from '@/context/AuthContext';

const Overview = () => {
  const { user } = useAuth();

  // Fetch patient bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['patient-bookings'],
    queryFn: getPatientBookings,
    enabled: !!user,
  });

  // Fetch patient records
  const { data: recordsData, isLoading: recordsLoading } = useQuery({
    queryKey: ['patient-records'],
    queryFn: () => getAllRecords({ page: 1, limit: 1 }),
    enabled: !!user,
  });

  // Fetch patient profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['patient-profile'],
    queryFn: getPatientProfile,
    enabled: !!user,
  });

  // Calculate statistics
  const totalBookings = bookingsData?.data?.length || 0;
  const totalRecords = recordsData?.pagination?.total || 0;
  const upcomingBookings = bookingsData?.data?.filter((booking: { status: string; appointmentDate: string }) => {
    if (booking.status !== 'accepted') return false;
    const appointmentDate = new Date(booking.appointmentDate);
    return appointmentDate >= new Date();
  }).length || 0;

  const displayName = profileData?.data?.user?.fullName || profileData?.data?.user?.username || user?.fullName || 'Patient';

  return (
    <section className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome back, {displayName.split(' ')[0]}!
        </h2>
        <p className="text-gray-600">
          Here&apos;s an overview of your eye care journey with Nethra.
        </p>
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
          title="Upcoming Appointments"
          value={upcomingBookings}
          icon={HiCalendar}
          loading={bookingsLoading}
        />
        <StatCard
          title="Medical Records"
          value={totalRecords}
          icon={HiDocumentText}
          loading={recordsLoading}
        />
        <StatCard
          title="AI Consultations"
          value={0}
          icon={FaStarOfLife}
        />
      </DashboardGrid>

      {/* Quick Actions */}
      <DashboardGrid columns={2} gap="md">
        <GridCard height="h-[300px]" colSpan={1}>
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <button
                onClick={() => window.location.href = '/dashboard/patient?tab=ai_agent'}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-cyan hover:bg-primary-cyan/5 transition-all group"
              >
                <FaStarOfLife className="w-8 h-8 text-gray-400 group-hover:text-primary-cyan mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-cyan transition-colors">
                  AI Agent
                </span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/patient?tab=bookings'}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-cyan hover:bg-primary-cyan/5 transition-all group"
              >
                <HiCalendar className="w-8 h-8 text-gray-400 group-hover:text-primary-cyan mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-cyan transition-colors">
                  Book Appointment
                </span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/patient?tab=medical_history'}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-cyan hover:bg-primary-cyan/5 transition-all group"
              >
                <HiDocumentText className="w-8 h-8 text-gray-400 group-hover:text-primary-cyan mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-cyan transition-colors">
                  View Records
                </span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/patient?tab=shopping'}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-cyan hover:bg-primary-cyan/5 transition-all group"
              >
                <HiShoppingBag className="w-8 h-8 text-gray-400 group-hover:text-primary-cyan mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-cyan transition-colors">
                  Shop
                </span>
              </button>
            </div>
          </div>
        </GridCard>

        <GridCard height="h-[300px]" colSpan={1}>
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p className="text-sm">No recent activity to display</p>
            </div>
          </div>
        </GridCard>
      </DashboardGrid>
    </section>
  );
};

export default Overview;
