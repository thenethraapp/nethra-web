// import React, { useState } from 'react';
// import { Star, BadgeCheck, Pencil, Save, X, Plus, Minus } from 'lucide-react';
// import { ProfileData } from '@/types/profile';

// interface ProfileUpdateData {
//   expertise: string[];
//   yearsOfExperience: number;
//   photo: string;
//   about: string;
//   location: string;
// }

// interface ProfessionalDetailsProps {
//   profileData: ProfileData | null;
//   isOwnProfile: boolean;
//   hasProfile: boolean;
//   onUpdate: (data: ProfileUpdateData) => Promise<{ success: boolean; message?: string }>;
// }

// export default function ProfessionalDetails({ profileData, isOwnProfile, hasProfile, onUpdate }: ProfessionalDetailsProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({
//     expertise: profileData?.profile?.expertise || [],
//     yearsOfExperience: profileData?.profile?.yearsOfExperience || 0
//   });
//   const [newExpertise, setNewExpertise] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditData({
//       expertise: [...(profileData?.profile?.expertise || [])],
//       yearsOfExperience: profileData?.profile?.yearsOfExperience || 0
//     });
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditData({
//       expertise: profileData?.profile?.expertise || [],
//       yearsOfExperience: profileData?.profile?.yearsOfExperience || 0
//     });
//     setNewExpertise('');
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     try {
//       const updatePayload: ProfileUpdateData = {
//         expertise: editData.expertise,
//         yearsOfExperience: editData.yearsOfExperience,
//         // Include other required fields for optometrist profile
//         photo: profileData?.profile?.photo || '',
//         about: profileData?.profile?.about || '',
//         location: profileData?.profile?.location || ''
//       };

//       const result = await onUpdate(updatePayload);

//       if (result.success) {
//         setIsEditing(false);
//         setNewExpertise('');
//       } else {
//         alert(result.message || 'Failed to update professional details');
//       }
//     } catch (error) {
//       alert('An error occurred while updating professional details');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addExpertise = () => {
//     if (newExpertise.trim() && !editData.expertise.includes(newExpertise.trim())) {
//       setEditData(prev => ({
//         ...prev,
//         expertise: [...prev.expertise, newExpertise.trim()]
//       }));
//       setNewExpertise('');
//     }
//   };

//   const removeExpertise = (expertiseToRemove: string) => {
//     setEditData(prev => ({
//       ...prev,
//       expertise: prev.expertise.filter(exp => exp !== expertiseToRemove)
//     }));
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       addExpertise();
//     }
//   };

//   // Calculate average rating
//   const ratings = profileData?.profile?.ratings || [];
//   const averageRating = ratings.length > 0
//     ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
//     : 0;

//   const totalReviews = profileData?.profile?.reviews?.length || 0;

//   return (
//     <div className="bg-white shadow-lg rounded-xl p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-2">
//           <BadgeCheck className="text-indigo-600" />
//           <p className="text-sm text-gray-500">Professional details shown to users</p>
//         </div>
//         {isOwnProfile && (
//           <div className="flex gap-2">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={handleCancel}
//                   disabled={isLoading}
//                   className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   disabled={isLoading}
//                   className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
//                 >
//                   <Save className="w-4 h-4" />
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={handleEdit}
//                 className="text-indigo-600 hover:text-indigo-800"
//               >
//                 <Pencil className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Expertise Section */}
//       <div className="mb-4">
//         <p className="font-medium mb-2">Expertise In</p>
//         {isEditing ? (
//           <div className="space-y-2">
//             <div className="flex flex-wrap gap-2">
//               {editData.expertise.map((expertise, index) => (
//                 <span
//                   key={index}
//                   className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
//                 >
//                   {expertise}
//                   <button
//                     onClick={() => removeExpertise(expertise)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <Minus className="w-3 h-3" />
//                   </button>
//                 </span>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={newExpertise}
//                 onChange={(e) => setNewExpertise(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Add new expertise"
//                 className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
//               />
//               <button
//                 onClick={addExpertise}
//                 className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
//               >
//                 <Plus className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-wrap gap-2">
//             {(profileData?.profile?.expertise ?? []).length > 0 ? (
//               (profileData?.profile?.expertise ?? []).map((expertise, index) => (
//                 <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   {expertise}
//                 </span>
//               ))
//             ) : (
//               <span className="text-gray-500 text-sm">No expertise added yet</span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Years of Experience */}
//       <div className="mb-4">
//         <p className="font-medium">Total Experience</p>
//         <div className="bg-gray-50 rounded-md p-3 mt-1 flex justify-between items-center shadow-inner">
//           {isEditing ? (
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 value={editData.yearsOfExperience}
//                 onChange={(e) => setEditData(prev => ({
//                   ...prev,
//                   yearsOfExperience: parseInt(e.target.value) || 0
//                 }))}
//                 className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
//                 min="0"
//                 max="50"
//               />
//               <span className="text-gray-500 text-sm">years of experience</span>
//             </div>
//           ) : (
//             <>
//               <span className="text-gray-800 font-semibold">
//                 {profileData?.profile?.yearsOfExperience || 0} Years
//               </span>
//               <span className="text-gray-500 text-sm">of total experience</span>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Ratings - Read only */}
//       <div className="mb-4">
//         <p className="font-medium">Ratings</p>
//         <div className="bg-blue-100 text-blue-700 rounded-md p-3 mt-1 flex justify-between items-center">
//           <div className="flex items-center gap-1">
//             <Star className="w-5 h-5 fill-current" />
//             <span className="font-semibold">
//               {averageRating > 0 ? `${averageRating.toFixed(1)} Stars` : 'No ratings yet'}
//             </span>
//           </div>
//           <span className="text-sm text-blue-700">
//             {totalReviews > 0 ? `from ${totalReviews} users` : 'No reviews yet'}
//           </span>
//         </div>
//       </div>

//       {/* Loading state overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
//           <div className="text-sm text-gray-600">Updating...</div>
//         </div>
//       )}
//     </div>
//   );
// }

import React from 'react';
import { Star, BadgeCheck } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface ProfessionalDetailsProps {
  profileData: ProfileData | null;
}

export default function ProfessionalDetails({ profileData }: ProfessionalDetailsProps) {
  // Calculate average rating
  const ratings = profileData?.profile?.ratings || [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;

  const totalReviews = profileData?.profile?.reviews?.length || 0;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <BadgeCheck className="text-indigo-600" />
        <p className="text-sm text-gray-500">Professional details</p>
      </div>

      {/* Expertise Section */}
      <div className="mb-4">
        <p className="font-medium mb-2">Expertise In</p>
        <div className="flex flex-wrap gap-2">
          {(profileData?.profile?.expertise ?? []).length > 0 ? (
            (profileData?.profile?.expertise ?? []).map((expertise, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {expertise}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No expertise added yet</span>
          )}
        </div>
      </div>

      {/* Years of Experience */}
      <div className="mb-4">
        <p className="font-medium">Total Experience</p>
        <div className="bg-gray-50 rounded-md p-3 mt-1 flex justify-between items-center shadow-inner">
          <span className="text-gray-800 font-semibold">
            {profileData?.profile?.yearsOfExperience || 0} Years
          </span>
          <span className="text-gray-500 text-sm">of total experience</span>
        </div>
      </div>

      {/* Ratings */}
      <div className="mb-4">
        <p className="font-medium">Ratings</p>
        <div className="bg-blue-100 text-blue-700 rounded-md p-3 mt-1 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold">
              {averageRating > 0 ? `${averageRating.toFixed(1)} Stars` : 'No ratings yet'}
            </span>
          </div>
          <span className="text-sm text-blue-700">
            {totalReviews > 0 ? `from ${totalReviews} users` : 'No reviews yet'}
          </span>
        </div>
      </div>
    </div>
  );
}