import {
  User,
  Calendar,
  MessageCircle,
  FileText,
  CreditCard,
  DollarSign,
  Settings, HelpCircle, X, LogOut,
  ShoppingCart
} from 'lucide-react';
import { FaStarOfLife } from "react-icons/fa6";
import { useRouter } from 'next/router';
import LogoDark from '@/component/common/UI/LogoDark';
import { useAuth } from '@/context/AuthContext';
import { ImProfile } from 'react-icons/im';

interface Items {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
}

interface UserData {
  user: {
    id: string;
    email: string;
    phone: string;
    role: string;
    fullName: string;
    certificateType: string;
    idNumber: string;
    expiryDate: string;
    createdAt: string;
    updatedAt: string;
  };
  profile: {
    _id: string;
    user: string;
    photo: string;
    about: string;
    badgeStatus: string;
    location: string;
    expertise: string[];
    yearsOfExperience: number;
    ratings: [];
    reviews: [];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

const SideBar = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  onLogout,
  userData
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout: () => void;
  userData: UserData | null;
}) => {

  const router = useRouter();
  const { user } = useAuth();

  // Get user role from userData or fallback to context
  const userRole = userData?.user?.role || user?.role || 'patient';

  // Menu items configuration based on role
  const getMenuItemsByRole = (role: string): Items[] => {
    switch (role) {
      case 'optometrist':
        return [
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'patient_records', label: 'Patient Records', icon: FileText },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          // { id: 'manage_subscriptions', label: 'Manage Subscriptions', icon: CreditCard },
          // { id: 'payment_settings', label: 'Payment Settings', icon: DollarSign },
          { id: 'profile', label: 'Profile', icon: ImProfile }
        ];

      case 'patient':
        return [
          { id: 'ai_agent', label: 'Nethra Super Agent', icon: FaStarOfLife },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'medical_history', label: 'Medical History', icon: FileText },
          { id: 'payment_settings', label: 'Payment Settings', icon: DollarSign },
          { id: 'shopping', label: 'Shopping History', icon: ShoppingCart },
        ];

      case 'admin':
      case 'superadmin':
        return [
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'manage_users', label: 'Manage Users', icon: User },
          { id: 'manage_bookings', label: 'Manage Bookings', icon: Calendar },
          { id: 'payment_settings', label: 'Payment Settings', icon: DollarSign },
        ];

      default:
        return [
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
        ];
    }
  };

  const getActionItemsByRole = (role: string): Items[] => {
    if (role === 'admin') {
      return [
        { id: 'manage_admins', label: 'Manage Admins', icon: Settings },
        { id: 'logout', label: 'Logout', icon: LogOut, action: onLogout },
      ];
    }

    return [
      { id: 'logout', label: 'Logout', icon: LogOut, action: onLogout },
    ];
  };

  const menuItems = getMenuItemsByRole(userRole);
  const actionItems = getActionItemsByRole(userRole);

  const handleItemClick = (item: Items) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    } else {
      setActiveTab(item.id);
    }
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">

      <div className=" h-20 border-b border-gray-200 flex items-center justify-center relative">
        {/* animated open and close sidebar */}
        {/* <button className='absolute top-2 right-2'>{"<"}</button> */}
        <LogoDark width={80} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full cursor-pointer flex items-center gap-3 py-3 px-4 text-left rounded-xl transition-colors ${isActive
                  ? 'bg-primary-cyan text-white'
                  : 'text-grayblue hover:bg-gray-100 hover:text-charcoal'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          {actionItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                  ${isActive ? 'bg-vividblue text-white' : 'text-grayblue hover:bg-gray-100 hover:text-charcoal'}
                  ${item.id == 'logout' ? 'hover:bg-red-100 hover:text-red-800 text-red-800 flex flex-row-reverse justify-between' : ''} cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-grayblue transition-colors`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 h-full bg-white border-r border-gray-200 z-40">
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMobileOpen(false)} className="text-grayblue hover:text-charcoal">
            <X size={24} />
          </button>
        </div>
        {sidebarContent}
      </div>
    </>
  );
};

export default SideBar;