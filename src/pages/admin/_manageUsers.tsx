import { getAllUsers } from "@/api/admin/getAllUsers";
import { useAuth } from "@/context/AuthContext";

import { useState, useEffect } from 'react';
import { Users, UserCheck, Activity, Search } from 'lucide-react';
import StatsCard from '@/component/features/admin/manageUsers/StatsCard';
import UserDetailsModal from "@/component/features/admin/manageUsers/userDetailsModal";
import ConfirmationModal from "@/component/features/admin/manageUsers/confirmationModal";
import UserTable from "@/component/features/admin/manageUsers/userTable";

// Types
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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Main Component
const ManageUsers = () => {

  const [activeTab, setActiveTab] = useState<'all' | 'optometrists' | 'patients'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [, setShowUserModal] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'suspend' | 'unsuspend' | 'reset';
    userId: string;
  }>({ isOpen: false, type: 'suspend', userId: '' });
  const [error, setError] = useState<string | null>(null);

  // Calculate stats from users
  const stats = {
    total: users.length,
    optometrists: users.filter(u => u.role === 'optometrist').length,
    patients: users.filter(u => u.role === 'patient').length,
  };

  useEffect(() => {
    console.log('Users:', users);
  }, [users])

  useEffect(() => {
    loadUsers();
  }, [activeTab, pagination.page]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare params based on active tab
      const params:
        {
          page: number;
          limit: number;
          role?: 'optometrist' | 'patient';
        }
        = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Add role filter based on active tab
      if (activeTab === 'optometrists') {
        params.role = 'optometrist';
      } else if (activeTab === 'patients') {
        params.role = 'patient';
      }

      const response = await getAllUsers(params);

      console.log('Get all users response:', response);

      if (response.success) {
        setUsers(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Failed to fetch users');
        setUsers([]);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('An unexpected error occurred while loading users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setSelectedUser(user);
      // Mock profile data - will be replaced with getUserById later
      setSelectedProfile({
        phoneNumber: user.phone || 'N/A',
        dateOfBirth: '1990-05-15',
        address: '123 Main Street, Lagos',
      });
      setShowUserModal(true);
    }
  };

  const handleSuspendUser = (userId: string) => {
    setConfirmModal({ isOpen: true, type: 'suspend', userId });
  };

  const handleUnsuspendUser = (userId: string) => {
    setConfirmModal({ isOpen: true, type: 'unsuspend', userId });
  };

  const handleResetPassword = (userId: string) => {
    setConfirmModal({ isOpen: true, type: 'reset', userId });
  };

  const executeAction = async () => {
    const { type, userId } = confirmModal;
    // Execute API calls here - will be implemented later
    console.log(`Executing ${type} for user ${userId}`);
    setConfirmModal({ isOpen: false, type: 'suspend', userId: '' });
    loadUsers();
  };

  const filteredUsers = users.filter(user => {
    const name = user.role === 'patient' ? user.username : user.fullName;
    return `${name} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  // if (loading) {
  //   return <WheelLoader />;
  // }

  return (
    <div className="min-h-screen bg-softwhite p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Users</h1>
          <p className="text-grayblue">Monitor and manage all users in the system</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={<Users className="w-6 h-6 text-vividblue" />}
            title="Total Users"
            count={pagination.total || stats.total}
            color="bg-blue-50"
            bgColor="bg-white"
          />
          <StatsCard
            icon={<UserCheck className="w-6 h-6 text-vividblue" />}
            title="Optometrists"
            count={stats.optometrists}
            color="bg-blue-50"
            bgColor="bg-white"
          />
          <StatsCard
            icon={<Activity className="w-6 h-6 text-vividgreen" />}
            title="Patients"
            count={stats.patients}
            color="bg-green-50"
            bgColor="bg-white"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-8">
              {(['all', 'optometrists', 'patients'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className={`cursor-pointer py-4 px-2 font-semibold text-sm transition-colors relative ${activeTab === tab
                      ? 'text-vividblue'
                      : 'text-grayblue hover:text-charcoal'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-vividblue" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-grayblue w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-vividblue focus:border-transparent"
              />
            </div>
          </div>

          {/* User Table */}
          <div className="p-6">
            <UserTable
              users={filteredUsers}
              onViewUser={handleViewUser}
              onSuspendUser={handleSuspendUser}
              onUnsuspendUser={handleUnsuspendUser}
              onResetPassword={handleResetPassword}
            />
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-grayblue">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-grayblue hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-grayblue hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UserDetailsModal
        user={selectedUser}
        profile={selectedProfile}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
          setSelectedProfile(null);
        }}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.type === 'suspend'
            ? 'Suspend User'
            : confirmModal.type === 'unsuspend'
              ? 'Unsuspend User'
              : 'Reset Password'
        }
        message={
          confirmModal.type === 'suspend'
            ? 'Are you sure you want to suspend this user? They will not be able to access their account.'
            : confirmModal.type === 'unsuspend'
              ? 'Are you sure you want to unsuspend this user? They will regain access to their account.'
              : 'Are you sure you want to reset this user\'s password? They will receive an email with instructions.'
        }
        type={confirmModal.type === 'suspend' ? 'danger' : 'warning'}
        onConfirm={executeAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'suspend', userId: '' })}
      />
    </div>
  );
};

export default ManageUsers;