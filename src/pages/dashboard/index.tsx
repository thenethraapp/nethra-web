import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import WheelLoader from '@/component/common/UI/WheelLoader';

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'optometrist') {
        router.replace('/dashboard/optometrist?tab=overview');
      } else {
        router.replace('/dashboard/patient?tab=overview');
      }
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <WheelLoader />
    </div>
  );
};

export default Dashboard;