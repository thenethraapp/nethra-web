import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ModernSidebar } from '@/component/features/dashboard/ModernSidebar';
import { DashboardHeader } from '@/component/features/dashboard';
import Overview from './_overview';
import Bookings from './_bookings';
import Messages from '@/component/features/messages/Messages';
import { useAuth } from '@/context/AuthContext';
import Help from '@/component/features/dashboard/help';
import PatientRecords from './_patientRecords';
import PaymentSettings from '@/component/features/dashboard/paymentSettings';
import ManageSubscriptions from '@/component/features/dashboard/manageSubscriptions';
import EditProfile from './_editProfile';
import ProfileUncompleted from '@/component/common/modals/profileUncompleted';
import WheelLoader from '@/component/common/UI/WheelLoader';
import NotificationsSideBar from '@/component/features/notifications/notificationsSidebar';
import { useProfile } from '@/context/ProfileContext';

const OptometristDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const tabFromUrl = (router.query.tab as string) || 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsSidebar, setShowNotificationsSidebar] = useState(false);
  const [hasSeenProfileModal, setHasSeenProfileModal] = useState(false);

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab as string);
    }
  }, [router.query.tab]);

  const { profileData, isLoading, isProfileIncomplete } = useProfile();
  
  useEffect(() => {
    if (isProfileIncomplete && !hasSeenProfileModal) {
      setShowProfileModal(true);
    }
  }, [isProfileIncomplete, hasSeenProfileModal]);

  const handleSetActiveTab = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      router.push(
        {
          pathname: '/dashboard/optometrist',
          query: { tab },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  const handleCompleteProfile = useCallback(() => {
    setShowProfileModal(false);
    handleSetActiveTab('profile');
  }, [handleSetActiveTab]);

  const handleCloseProfileModal = useCallback(() => {
    setShowProfileModal(false);
    setHasSeenProfileModal(true);
  }, []);

  const handleShowNotifications = useCallback(() => {
    setShowNotificationsSidebar(true);
  }, []);

  const handleCloseNotifications = useCallback(() => {
    setShowNotificationsSidebar(false);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <WheelLoader />
      </div>
    );
  }

  if (user.role !== 'optometrist') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Access Denied</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview isLoading={isLoading} profileData={profileData || null} />;
      case 'bookings':
        return <Bookings />;
      case 'payment_settings':
        return <PaymentSettings />;
      case 'patient_records':
        return <PatientRecords />;
      case 'manage_subscriptions':
        return <ManageSubscriptions />;
      case 'messages':
        return <div className='h-[calc(100vh-120px)]'><Messages /></div>;
      case 'profile':
        return <EditProfile />;
      case 'help':
        return <Help />;
      default:
        return <Overview profileData={profileData || null} />;
    }
  };

  return (
    <>
      {showProfileModal && (
        <ProfileUncompleted
          onClose={handleCloseProfileModal}
          onCompleteProfile={handleCompleteProfile}
        />
      )}

      <NotificationsSideBar
        isOpen={showNotificationsSidebar}
        onClose={handleCloseNotifications}
      />

      <div className="flex min-h-screen bg-primary-blue">
        <ModernSidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onLogout={logout}
          userData={profileData || null}
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
                profileData={profileData || null}
                onLogout={logout}
                onNavigate={handleSetActiveTab}
                isLoading={isLoading}
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
    </>
  );
};

export default OptometristDashboard;
