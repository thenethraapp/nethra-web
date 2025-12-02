import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import SideBar from '@/component/features/dashboard/sideBar';
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
import DashboardHeader from '@/component/features/dashboard/dashboardHeader';
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
    setHasSeenProfileModal(true); // Prevent it from showing again
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
        return <div className='h-[calc(100vh-120px)]'><Messages /></div>
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

      <div className="fixed inset-0">
        <div className="flex h-full w-full overflow-hidden">
          {/* Sidebar - Handles both desktop and mobile */}
          <SideBar
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            onLogout={logout}
            // @ts-expect-error - Type issue
            userData={profileData || null}
          />

          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 w-full lg:w-auto">
            <DashboardHeader
              profileData={profileData || null}
              activeTab={activeTab}
              onShowNotificationsSidebar={handleShowNotifications}
              onLogout={logout}
              onNavigate={handleSetActiveTab}
              isLoading={isLoading}
              onToggleMobileMenu={() => setIsMobileOpen(true)}
            />

            <div className="flex-1 overflow-y-auto">
              <div className="p-3 sm:p-4 lg:p-6">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OptometristDashboard;