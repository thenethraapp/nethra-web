
import React, { useEffect, useState } from 'react';
import ProfileCard from './_ProfileCard';
import ProfessionalDetails from './_ProfessionalDetails';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/api/profile/getUserProfile';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import WheelLoader from '@/component/common/UI/WheelLoader';

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { userId } = router.query;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = !userId || userId === user?.id;
  const userRole = profileData?.user?.role || user?.role;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        const targetUserId = userId;

        if (!targetUserId) {
          setError('User not found');
          return;
        }

        const data = await getUserProfile(targetUserId);
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (userId || user?.id) {
      fetchProfileData();
    }
  }, [userId, user?.id]);

  if (loading) {
    return (
      <WheelLoader />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-width px-6 py-12">
      <div>
        <ProfileCard profileData={profileData.data} />
        {!isOwnProfile && userRole !== 'optometrist' && (
          <div>
            <Link
              className='inline-block mt-6 px-12 py-4 bg-vividblue cursor-pointer rounded-full text-white font-medium hover:bg-vividblue/70 transition'
              href={`/booking?optometristId=${profileData.data.user.id}`}>
              <span className='flex items-center justify-center gap-2'>
                <Calendar size={18} />
                Book Appointment
              </span>
            </Link>
          </div>
        )}
      </div>
      <div className='flex flex-col justify-between'>
        <ProfessionalDetails profileData={profileData.data} />
      </div>
    </div>
  );
};

export default Profile;