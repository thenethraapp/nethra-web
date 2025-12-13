import { useState, useEffect } from 'react';
import { Users, UserCheck, Activity } from 'lucide-react';
import StatsCard from '@/component/features/admin/manageUsers/StatsCard';
import { getAllWaitlist, WaitlistEntry } from '@/api/admin/getAllWaitlist';

const Overview = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    patients: 0,
    doctors: 0
  });

  useEffect(() => {
    loadWaitlist();
  }, []);

  const loadWaitlist = async () => {
    try {
      setLoading(true);
      const response = await getAllWaitlist({ limit: 1000 }); // Get all entries for stats

      if (response.success && response.data) {
        setWaitlistEntries(response.data);

        // Calculate stats
        const total = response.data.length;
        const patients = response.data.filter(e => e.role === 'patient').length;
        const doctors = response.data.filter(e => e.role === 'optometrist').length;

        setStats({ total, patients, doctors });
      }
    } catch (error) {
      console.error('Error loading waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-softwhite p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Waitlist</h1>
          <p className="text-grayblue">Monitor and manage waitlist entries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={<Users className="w-6 h-6 text-vividblue" />}
            title="Total Waitlist"
            count={stats.total}
            color="bg-blue-50"
            bgColor="bg-white"
          />
          <StatsCard
            icon={<Activity className="w-6 h-6 text-vividgreen" />}
            title="Total Patients"
            count={stats.patients}
            color="bg-green-50"
            bgColor="bg-white"
          />
          <StatsCard
            icon={<UserCheck className="w-6 h-6 text-vividblue" />}
            title="Total Doctors"
            count={stats.doctors}
            color="bg-blue-50"
            bgColor="bg-white"
          />
        </div>

        {/* Waitlist Table */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan mx-auto"></div>
                <p className="text-grayblue mt-4">Loading waitlist...</p>
              </div>
            ) : waitlistEntries.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-grayblue mx-auto mb-4 opacity-50" />
                <p className="text-grayblue text-lg">No waitlist entries found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Name</th>
                      <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Email</th>
                      <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Phone</th>
                      <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Type</th>
                      <th className="text-left py-4 px-4 text-grayblue font-semibold text-sm">Signup Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlistEntries.map((entry) => (
                      <tr key={entry._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-medium text-charcoal">{entry.fullName || 'N/A'}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-grayblue">{entry.email}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-grayblue">{entry.phone || 'Not provided'}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${entry.role === 'optometrist' ? 'bg-vividblue text-white' : 'bg-vividgreen text-white'
                            }`}>
                            {entry.role === 'optometrist' ? 'Doctor' : 'Patient'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-grayblue">
                            {new Date(entry.signupDate || entry.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview