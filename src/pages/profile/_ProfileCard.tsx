

// import React, { useState } from 'react';
// import { Pencil, Save, X } from 'lucide-react';
// import { ProfileData } from '@/types/profile';
// import UserAvatar from '@/component/UI/UserAvatar';

// interface UpdateData {
//   location?: string;
//   profilePhoto?: string;
//   about?: string;
//   photo?: string;
// }

// interface ProfileCardProps {
//   profileData: ProfileData | null;
//   isOwnProfile: boolean;
//   hasProfile: boolean;
//   onUpdate: (data: UpdateData) => Promise<{ success: boolean; message?: string }>;
// }

// export default function ProfileCard({ profileData, isOwnProfile, hasProfile, onUpdate }: ProfileCardProps) {
//   const [isEditing, setIsEditing] = useState(!hasProfile && isOwnProfile);
//   const [editData, setEditData] = useState({
//     location: profileData?.profile?.location || '',
//     profilePhoto: profileData?.profile?.profilePhoto || profileData?.profile?.photo || '',
//     about: profileData?.profile?.about || ''
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const userRole = profileData?.user?.role;
//   const isPatient = userRole === 'patient';
//   const isOptometrist = userRole === 'optometrist';

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditData({
//       location: profileData?.profile?.location || '',
//       profilePhoto: profileData?.profile?.profilePhoto || profileData?.profile?.photo || '',
//       about: profileData?.profile?.about || ''
//     });
//   };

//   const handleCancel = () => {
//     if (!hasProfile && isOwnProfile) return; // Don't allow cancel if profile doesn't exist
//     setIsEditing(false);
//     setEditData({
//       location: profileData?.profile?.location || '',
//       profilePhoto: profileData?.profile?.profilePhoto || profileData?.profile?.photo || '',
//       about: profileData?.profile?.about || ''
//     });
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     try {
//       let updatePayload: UpdateData = {};

//       if (isPatient) {
//         updatePayload = {
//           location: editData.location,
//           profilePhoto: editData.profilePhoto
//         };
//       } else if (isOptometrist) {
//         updatePayload = {
//           photo: editData.profilePhoto,
//           about: editData.about,
//           location: editData.location
//         };
//       }

//       const result = await onUpdate(updatePayload);

//       if (result.success) {
//         setIsEditing(false);
//       } else {
//         alert(result.message || 'Failed to update profile');
//       }
//     } catch (error) {
//       alert('An error occurred while updating profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const displayName = profileData?.user?.fullName || profileData?.user?.username || 'User';
//   const displayEmail = profileData?.user?.email || '';
//   const displayPhone = profileData?.user?.phone || '';

//   return (
//     <div className="bg-white shadow-lg rounded-xl p-6">
//       <div className="flex flex-col items-center">
//         <div className="relative">
//           <UserAvatar size={80} />
//           <p className='text-gray-600 pt-4'>
//             {displayName}
//           </p>
//         </div>
//       </div>

//       <div className="mt-6 space-y-4 text-sm">
//         <InfoRow
//           label="Your Name"
//           value={displayName}
//           isEditing={false} // Names typically can't be edited in profile
//           onChange={() => { }}
//         />
//         <InfoRow
//           label="Email"
//           value={displayEmail}
//           isEditing={false} // Email typically can't be edited in profile
//           onChange={() => { }}
//         />
//         <InfoRow
//           label="Phone Number"
//           value={displayPhone}
//           isEditing={false} // Phone typically can't be edited in profile
//           onChange={() => { }}
//         />

//         {/* Location - editable */}
//         <InfoRow
//           label="Location"
//           value={isEditing ? editData.location : (profileData?.profile?.location || 'Not specified')}
//           isEditing={isEditing}
//           onChange={(value) => setEditData(prev => ({ ...prev, location: value }))}
//           canEdit={isOwnProfile}
//         />
//       </div>

//       {/* About Section - Only for optometrists */}
//       {isOptometrist && (
//         <div className="mt-6">
//           <SectionHeader
//             title="About"
//             highlight={displayName}
//             isEditing={isEditing}
//             canEdit={isOwnProfile}
//             onEdit={handleEdit}
//           />
//           {isEditing ? (
//             <textarea
//               value={editData.about}
//               onChange={(e) => setEditData(prev => ({ ...prev, about: e.target.value }))}
//               className="w-full mt-2 p-3 border border-gray-300 rounded-md text-sm resize-none"
//               rows={4}
//               placeholder="Tell us about yourself..."
//             />
//           ) : (
//             <p className="text-sm text-gray-600 mt-2">
//               {profileData?.profile?.about || 'No description provided yet.'}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Badge Status - Only for optometrists */}
//       {isOptometrist && (
//         <div className="mt-6">
//           <SectionHeader title="Legal" />
//           <div className="mt-2 flex justify-between text-sm">
//             <span>Badge Status</span>
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${profileData?.profile?.badgeStatus === 'verified'
//               ? 'bg-green-100 text-green-600'
//               : 'bg-yellow-100 text-yellow-600'
//               }`}>
//               {profileData?.profile?.badgeStatus === 'verified' ? 'Verified' : 'Pending'}
//             </span>
//           </div>
//           <div className="mt-2 flex justify-between text-sm">
//             <span>Certificate Type</span>
//             <span className="text-gray-600">{profileData?.user?.certificateType || 'N/A'}</span>
//           </div>
//         </div>
//       )}

//       {/* Edit Controls */}
//       {isOwnProfile && (
//         <div className="mt-6 flex justify-end gap-2">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={handleCancel}
//                 disabled={isLoading}
//                 className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={isLoading}
//                 className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
//               >
//                 <Save className="w-4 h-4" />
//                 {isLoading ? 'Saving...' : hasProfile ? 'Update' : 'Create'}
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={handleEdit}
//               className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
//             >
//               <Pencil className="w-4 h-4" />
//               Edit Profile
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function InfoRow({
//   label,
//   value,
//   isEditing,
//   onChange,
//   canEdit = false
// }: {
//   label: string;
//   value: string;
//   isEditing: boolean;
//   onChange: (value: string) => void;
//   canEdit?: boolean;
// }) {
//   return (
//     <div className="flex justify-between items-center border p-2 rounded-md">
//       <div className="flex-1">
//         <p className="text-gray-500 text-xs">{label}</p>
//         {isEditing && canEdit ? (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="font-medium bg-transparent border-none p-0 focus:outline-none w-full"
//           />
//         ) : (
//           <p className="font-medium">{value || 'Not specified'}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// function SectionHeader({
//   title,
//   highlight,
//   isEditing,
//   canEdit = false,
//   onEdit
// }: {
//   title: string;
//   highlight?: string;
//   isEditing?: boolean;
//   canEdit?: boolean;
//   onEdit?: () => void;
// }) {
//   return (
//     <div className="flex justify-between items-center">
//       <h3 className="font-semibold text-gray-700">
//         {title} {highlight && <span className="text-blue-500">{highlight}</span>}
//       </h3>
//       {canEdit && !isEditing && onEdit && (
//         <button
//           onClick={onEdit}
//           className="text-indigo-600 hover:text-indigo-800"
//         >
//           <Pencil className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   );
// }


import React from 'react';
import { ProfileData } from '@/types/profile';
import UserAvatar from '@/component/common/UI/UserAvatar';
import { MdVerified } from 'react-icons/md';

interface ProfileCardProps {
  profileData: ProfileData | null;
}

export default function ProfileCard({ profileData }: ProfileCardProps) {
  const userRole = profileData?.user?.role;
  const isOptometrist = userRole === 'optometrist';

  const displayName = profileData?.user?.fullName || profileData?.user?.username || 'User';
  const displayEmail = profileData?.user?.email || '';
  const displayPhone = profileData?.user?.phone || '';

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex flex-col items-center">
        <div className="relative flex flex-col justify-center items-center">
          <UserAvatar size={80} />
          <p className='text-gray-600 pt-4 flex items-center gap-1'>
            <span>
              {displayName}
            </span>
            <span className={` text-xs font-medium ${profileData?.profile?.badgeStatus === 'verified'
              ? 'text-deepteal'
              : 'text-deepteal'
              }`}>
              {profileData?.profile?.badgeStatus === 'verified' ? <MdVerified size={20} /> : <MdVerified size={20} />}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm">
        {/* <InfoRow label="Your Name" value={displayName} /> */}
        <InfoRow label="Email" value={displayEmail} />
        <InfoRow label="Phone Number" value={displayPhone} />
        <InfoRow label="Location" value={profileData?.profile?.location || 'Not specified'} />
      </div>

      {/* About Section - Only for optometrists */}
      {isOptometrist && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700">
            About <span className="text-blue-500">{displayName}</span>
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            {profileData?.profile?.about || 'No description provided yet.'}
          </p>
        </div>
      )}

      {/* Badge Status - Only for optometrists */}
      {isOptometrist && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Legal</h3>

          <div className="mt-2 flex justify-between text-sm">
            <span>Certificate Type</span>
            <span className="text-gray-600">{profileData?.user?.certificateType || 'N/A'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center p-2 rounded-md">
      <div className="flex-1">
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="font-medium">{value || 'Not specified'}</p>
      </div>
    </div>
  );
}