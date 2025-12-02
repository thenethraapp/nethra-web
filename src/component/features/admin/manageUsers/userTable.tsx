import { Users, Eye, Lock, Unlock, RefreshCw } from 'lucide-react';


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

const UserTable: React.FC<{
    users: User[];
    onViewUser: (userId: string) => void;
    onSuspendUser: (userId: string) => void;
    onUnsuspendUser: (userId: string) => void;
    onResetPassword: (userId: string) => void;
  }> = ({ users, onViewUser, onSuspendUser, onUnsuspendUser, onResetPassword }) => {
  
  
    if (users.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-grayblue mx-auto mb-4 opacity-50" />
          <p className="text-grayblue text-lg">No users found</p>
        </div>
      );
    }
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Name</th>
              <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Email</th>
              <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Role</th>
              <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Status</th>
              <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Verified</th>
              <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <p className="font-medium text-charcoal">{user.fullName || user.username}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-grayblue">{user.email}</p>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'optometrist' ? 'bg-vividblue text-white' : 'bg-vividgreen text-white'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.isEmailVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewUser(user._id)}
                      className="cursor-pointer p-2 hover:bg-vividblue hover:text-white text-vividblue rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {user.isSuspended ? (
                      <button
                        // onClick={() => onUnsuspendUser(user._id)}
                        className="cursor-pointer p-2 hover:bg-vividgreen hover:text-white text-vividgreen rounded-lg transition-all"
                        title="Unsuspend User"
                      >
                        <Unlock className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        // onClick={() => onSuspendUser(user._id)}
                        className="cursor-pointer p-2 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-all"
                        title="Suspend User"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      // onClick={() => onResetPassword(user._id)}
                      className="cursor-pointer p-2 hover:bg-yellow-600 hover:text-white text-yellow-600 rounded-lg transition-all"
                      title="Reset Password"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default UserTable;