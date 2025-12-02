import { useEffect, useState } from 'react';
import SideBar from '@/component/features/dashboard/sideBar';
import Overview from './_overview';
import ManageBookings from './_manageBookings';
import ManageUsers from './_manageUsers';
import PaymentSettings from './_paymentSettings';
import ManageAdmins from './_manageAdmins';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('manage_users');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.role === 'admin') {
        setLoading(true);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Access Denied {JSON.stringify(user)}</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;

      case 'manage_users':
        return <ManageUsers />;

      case 'manage_bookings':
        return <ManageBookings />;

      case 'payment_settings':
        return <PaymentSettings />;

      case 'manage_admins':
        return <ManageAdmins />;

      default:
        // return <Overview />;
        return <ManageUsers />
    }
  };

  return (
    <div className="min-h-screen -mt-[100px]">
      {/* Sidebar - Pass userData to SideBar */}
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={logout}
        userData={userData}
      />

      <div className="lg:ml-80">
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="text-grayblue hover:text-charcoal"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-charcoal capitalize">
            {activeTab.replace('_', ' ')}
          </h1>
          <div></div>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;