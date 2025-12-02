import { User, Edit, CreditCard, Lock, HelpCircle, Globe, LogOut } from 'lucide-react';

const ProfileDropdown = ({ 
  isOpen, 
  onClose, 
  onViewProfile,
  onEditProfile,
  onPaymentSettings,
  onAccountSettings,
  onHelp,
  onViewPublicProfile,
  onLogout
}: {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: () => void;
  onEditProfile: () => void;
  onPaymentSettings: () => void;
  onAccountSettings: () => void;
  onHelp: () => void;
  onViewPublicProfile: () => void;
  onLogout: () => void;
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: 'View Profile', onClick: onViewProfile },
    { icon: Edit, label: 'Edit Profile', onClick: onEditProfile },
    { icon: CreditCard, label: 'Payment Settings', onClick: onPaymentSettings },
    { icon: Lock, label: 'Account Settings', onClick: onAccountSettings },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Help & Support', onClick: onHelp },
    { icon: Globe, label: 'View Public Profile', onClick: onViewPublicProfile },
    { icon: LogOut, label: 'Log Out', onClick: onLogout, danger: true },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown menu */}
      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
        <div className="px-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="my-2 border-t border-gray-200" />

        <div className="px-2">
          {bottomItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md transition-colors cursor-pointer ${
                item.danger 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;