import { X } from 'lucide-react';

interface User {
  _id: string;
  username?: string;
  fullName?: string;
  email: string;
  role: 'patient' | 'optometrist' | 'admin' | 'superadmin';
  isEmailVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  certificateType?: string;
  idNumber?: string;
  expiryDate?: string;
}

  interface Profile {
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
    specialty?: string;
    licenseNumber?: string;
  }

const UserDetailsModal: React.FC<{
    user: User | null;
    profile: Profile | null;
    onClose: () => void;
  }> = ({ user, profile, onClose }) => {
    if (!user) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-charcoal">User Details</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-grayblue" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="bg-lightlavender rounded-xl p-5">
              <h4 className="font-semibold text-charcoal mb-4 text-lg">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-grayblue text-sm mb-1">Name</p>
                  <p className="text-charcoal font-medium">{user.fullName || user.username}</p>
                </div>
                <div>
                  <p className="text-grayblue text-sm mb-1">Email</p>
                  <p className="text-charcoal font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-grayblue text-sm mb-1">Role</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'optometrist' ? 'bg-vividblue text-white' : 'bg-vividgreen text-white'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-grayblue text-sm mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                </div>
                <div>
                  <p className="text-grayblue text-sm mb-1">Email Verified</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div>
                  <p className="text-grayblue text-sm mb-1">Member Since</p>
                  <p className="text-charcoal font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
  
            {/* Profile Info */}
            {profile && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-charcoal mb-4 text-lg">Profile Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  {profile.phoneNumber && (
                    <div>
                      <p className="text-grayblue text-sm mb-1">Phone Number</p>
                      <p className="text-charcoal font-medium">{profile.phoneNumber}</p>
                    </div>
                  )}
                  {profile.dateOfBirth && (
                    <div>
                      <p className="text-grayblue text-sm mb-1">Date of Birth</p>
                      <p className="text-charcoal font-medium">
                        {new Date(profile.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {profile.address && (
                    <div className="col-span-2">
                      <p className="text-grayblue text-sm mb-1">Address</p>
                      <p className="text-charcoal font-medium">{profile.address}</p>
                    </div>
                  )}
                  {profile.specialty && (
                    <div>
                      <p className="text-grayblue text-sm mb-1">Specialty</p>
                      <p className="text-charcoal font-medium">{profile.specialty}</p>
                    </div>
                  )}
                  {profile.licenseNumber && (
                    <div>
                      <p className="text-grayblue text-sm mb-1">License Number</p>
                      <p className="text-charcoal font-medium">{profile.licenseNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

    export default UserDetailsModal;