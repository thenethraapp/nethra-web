import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Overview from './_overview';
import EditProfile from './_editProfile';
import Help from '@/component/features/dashboard/help';
import { useAuth } from '@/context/AuthContext';
import Messages from '@/component/features/messages/Messages';
import { ModernSidebar } from '@/component/features/dashboard/ModernSidebar';
import { DashboardHeader } from '@/component/features/dashboard';
import PaymentSettings from '@/component/features/dashboard/paymentSettings';
import AIAgent from './_aiAgent';
import PatientBookings from './_bookings';
import HealthRecords from './_healthRecords';
import { getPatientProfile } from '@/api/profile/patient/get-patient-profile';
import { useQuery } from '@tanstack/react-query';

const PatientDashboard = () => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('ai_agent');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Fetch patient profile data
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['patient-profile'],
    queryFn: getPatientProfile,
    enabled: !!user,
  });

  useEffect(() => {
    // Set initial tab from URL query if present
    if (router.query.tab && typeof router.query.tab === 'string') {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    router.push(
      {
        pathname: '/dashboard/patient',
        query: { tab },
      },
      undefined,
      { shallow: true }
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (user.role !== 'patient') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Access Denied</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'ai_agent':
        return <AIAgent />;
      case 'bookings':
        return <PatientBookings />;
      case 'medical_history':
        return <HealthRecords />;
      case 'payment_settings':
        return <PaymentSettings />;
      case 'shopping':
        return <div>Shopping History - Coming Soon</div>;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <EditProfile />;
      case 'help':
        return <Help />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-primary-blue">
      <ModernSidebar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={logout}
        userData={profileData?.data || null}
      />

      <main
        className="fixed top-0 left-0 right-0 bottom-0 transition-all duration-300 ease-in-out bg-primary-blue"
        style={{
          marginLeft: '288px',
          height: '100vh',
          width: 'calc(100vw - 288px)',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <div
          className="bg-white/90 w-full h-full rounded-l-[36px] flex flex-col relative"
          style={{
            overflow: 'hidden',
            minHeight: 0,
            minWidth: 0,
            height: '100%',
          }}
        >
          {/* Dashboard Header */}
          <div className="pt-5 px-5">
            <DashboardHeader
              activeTab={activeTab}
              profileData={profileData?.data || null}
              onLogout={logout}
              onNavigate={handleSetActiveTab}
              isLoading={isLoadingProfile}
            />
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 pt-2.5">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Mobile Layout */}
      <div className="lg:hidden fixed inset-0 flex flex-col bg-white">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800 capitalize">
            {activeTab.replace('_', ' ')}
          </h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
