import React, { useEffect, useState } from 'react';
import { Save, Pencil, X, BadgeCheck, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/api/profile/getUserProfile';
import { updateOptometristProfile } from '@/api/profile/optometrist/update-optometrist-profile';
import { createOptometristProfile } from '@/api/profile/optometrist/create-optometrist-profile';
import WheelLoader from '@/component/common/UI/WheelLoader';
import ImageUpload from '@/component/common/UI/ImageUpload';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';

interface OptometristProfileData {
  photo?: string;
  about: string;
  location: string;
  expertise: string[];
  yearsOfExperience: number;
  consultationFeeMin?: number;
  consultationFeeMax?: number;
}

interface ProfileData {
  user: {
    id: string;
    fullName?: string;
    username?: string;
    email?: string;
    phone?: string;
    role: string;
    certificateType?: string;
  };
  profile: {
    photo?: string;
    about?: string;
    location?: string;
    expertise?: string[];
    yearsOfExperience?: number;
    badgeStatus?: string;
    ratings?: number[];
    reviews?: [];
    consultationFeeMin?: number;
    consultationFeeMax?: number;
  } | null;
}

export default function OptometristProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newExpertise, setNewExpertise] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  const [editData, setEditData] = useState<OptometristProfileData>({
    photo: '',
    about: '',
    location: '',
    expertise: [],
    yearsOfExperience: 0,
    consultationFeeMin: undefined,
    consultationFeeMax: undefined
  });

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const expertiseSuggestions = [
    'Comprehensive eye examinations',
    'Refractive error assessment (myopia, hyperopia, astigmatism, presbyopia)',
    'Prescription of eyeglasses and contact lenses',
    'Contact lens fitting & management',
    'Ocular disease screening and management',
    'Glaucoma assessment',
    'Diabetic eye examination',
    'Cataract evaluation',
    'Dry eye assessment & management',
    'Pediatric optometry',
    'Low vision care',
    'Binocular vision & vision therapy',
    'Ocular emergencies & first-line management',
    'Pre- and post-operative care (e.g., cataract, LASIK)',
    'Visual field testing',
    'Retinal imaging & OCT interpretation',
    'Color vision assessment',
    'Occupational/industrial vision assessment',
    'Sports vision',
    'Geriatric eye care'
  ];

  const hasProfile = profileData?.profile !== null;

  useEffect(() => {
    fetchProfileData();
  }, [user?.id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        setError('User not found');
        return;
      }

      const data = await getUserProfile(user.id);
      setProfileData(data.data);

      // Initialize edit mode if no profile exists
      if (!data.data.profile) {
        setIsEditing(true);
        setEditData({
          photo: '',
          about: '',
          location: '',
          expertise: [],
          yearsOfExperience: 0,
          consultationFeeMin: undefined,
          consultationFeeMax: undefined
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      photo: profileData?.profile?.photo || '',
      about: profileData?.profile?.about || '',
      location: profileData?.profile?.location || '',
      expertise: [...(profileData?.profile?.expertise || [])],
      yearsOfExperience: profileData?.profile?.yearsOfExperience || 0,
      consultationFeeMin: profileData?.profile?.consultationFeeMin || undefined,
      consultationFeeMax: profileData?.profile?.consultationFeeMax || undefined
    });
  };

  const handleCancel = () => {
    if (!hasProfile) return;
    setIsEditing(false);
    setNewExpertise('');
  };

  const handleImageChange = (imageData: string) => {
    setEditData(prev => ({
      ...prev,
      photo: imageData
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate consultation fee range
      if (editData.consultationFeeMin !== undefined) {
        if (editData.consultationFeeMin < 3000) {
          alert('Minimum consultation fee must be at least ₦3,000');
          return;
        }
      }
      if (editData.consultationFeeMax !== undefined) {
        if (editData.consultationFeeMax < 3000) {
          alert('Maximum consultation fee must be at least ₦3,000');
          return;
        }
      }
      if (editData.consultationFeeMin && editData.consultationFeeMax) {
        if (editData.consultationFeeMax < editData.consultationFeeMin) {
          alert('Maximum fee must be greater than or equal to minimum fee');
          return;
        }
      }

      // Only include photo in payload if it's been changed (base64) or is a URL
      const payload: OptometristProfileData = {
        about: editData.about,
        location: editData.location,
        yearsOfExperience: editData.yearsOfExperience,
        expertise: editData.expertise
      };

      // Add consultation fee fields if provided
      if (editData.consultationFeeMin !== undefined) {
        payload.consultationFeeMin = editData.consultationFeeMin;
      }
      if (editData.consultationFeeMax !== undefined) {
        payload.consultationFeeMax = editData.consultationFeeMax;
      }

      if (editData.expertise.length > 0) {
        payload.expertise = editData.expertise;
      }

      if (editData.photo) {
        payload.photo = editData.photo;
      }

      let response;
      if (hasProfile) {
        response = await updateOptometristProfile(payload);
      } else {
        response = await createOptometristProfile(payload);
      }

      if (response.success) {
        await fetchProfileData();
        // Invalidate user profile query to refetch in navbar and other components
        queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
        setIsEditing(false);
        setNewExpertise('');
      } else {
        alert(response.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  const addExpertise = (expertiseText?: string) => {
    const expertiseToAdd = expertiseText || newExpertise.trim();
    if (expertiseToAdd && !editData.expertise.includes(expertiseToAdd)) {
      setEditData(prev => ({
        ...prev,
        expertise: [...prev.expertise, expertiseToAdd]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (expertiseToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertiseToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExpertise();
    }
  };

  const filteredStates = nigerianStates.filter(state =>
    state.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredSuggestions = expertiseSuggestions.filter(
    suggestion => !editData.expertise.includes(suggestion)
  );

  const ratings = profileData?.profile?.ratings || [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;
  const totalReviews = profileData?.profile?.reviews?.length || 0;

  if (loading) {
    return <WheelLoader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  const displayName = profileData?.user?.fullName || profileData?.user?.username || 'User';
  const displayEmail = profileData?.user?.email || '';
  const displayPhone = profileData?.user?.phone || '';

  return (
    <div className="min-h-screen relative">
      <div className="w-full mx-auto space-y-6 pb-30">
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {isEditing ? (
                <ImageUpload
                  currentImage={editData.photo || profileData?.profile?.photo}
                  onImageChange={handleImageChange}
                  size={80}
                  disabled={isSaving}
                />
              ) : (
                <div className="relative">
                  {profileData?.profile?.photo ? (
                    <img
                      src={profileData.profile.photo}
                      alt="Profile"
                      className="w-15 h-15 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary-cyan"
                      style={{ width: '60px', height: '60px' }}
                    />
                  ) : (
                    <Image
                      src="/icons/avatar.png"
                      alt="Profile"
                      width={60}
                      height={60}
                      className="w-15 h-15 sm:w-20 sm:h-20 rounded-full"
                    />
                  )}
                </div>
              )}
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">{displayName}</h1>
                <p className="text-gray-500 text-sm mt-1">{profileData?.user?.role}</p>
              </div>
            </div>

            {/* Action Buttons - Only show Edit button when not editing */}
            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="p-2 text-sm text-primary-cyan hover:text-primary-cyan/70 cursor-pointer transition-all duration-200 ease-in rounded-full flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:block">Edit</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between items-center border-none outline-none p-2 rounded-md">
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Your Name</p>
                <p className="font-medium">{displayName}</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-none outline-none p-2 rounded-md">
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Email</p>
                <p className="font-medium">{displayEmail}</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-none outline-none p-2 rounded-md">
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Phone Number</p>
                <p className="font-medium">{displayPhone}</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-none outline-none p-2 rounded-md">
              <div className="flex-1 relative">
                <p className="text-gray-500 text-xs">Location</p>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => {
                        setEditData(prev => ({ ...prev, location: e.target.value }));
                        setLocationSearch(e.target.value);
                        setShowLocationDropdown(true);
                      }}
                      onFocus={() => {
                        setLocationSearch(editData.location);
                        setShowLocationDropdown(true);
                      }}
                      onBlur={() => {
                        // Delay to allow click on dropdown items
                        setTimeout(() => setShowLocationDropdown(false), 200);
                      }}
                      placeholder="e.g., Lagos, Nigeria"
                      className="font-medium bg-transparent border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-primary-cyan w-full"
                    />
                    {showLocationDropdown && filteredStates.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredStates.map((state, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setEditData(prev => ({ ...prev, location: state }));
                              setShowLocationDropdown(false);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {state}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="font-medium">{profileData?.profile?.location || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">
              About <span className="text-primary-cyan">{displayName}</span>
            </h3>
          </div>
          {isEditing ? (
            <textarea
              value={editData.about}
              onChange={(e) => setEditData(prev => ({ ...prev, about: e.target.value }))}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md text-sm resize-none"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-sm text-gray-600 mt-2">
              {profileData?.profile?.about || 'Tell your patients about yourself'}
            </p>
          )}
        </div>

        {/* Professional Details Card */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-primary-cyan" />
              <p className="text-sm text-gray-500">Professional details shown to users</p>
            </div>
          </div>

          {/* Expertise Section */}
          <div>
            <p className="font-medium mb-2">Expertise In</p>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editData.expertise.map((expertise, index) => (
                    <span
                      key={index}
                      className="bg-primary-cyan text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      {expertise}
                      <button
                        onClick={() => removeExpertise(expertise)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <IoClose className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-0">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add new expertise"
                    className="w-full max-w-xl px-3 py-2 border border-gray-300 outline-none rounded-l-md text-sm"
                  />
                  <button
                    onClick={() => addExpertise()}
                    className="px-4 py-1 bg-primary-darkcyan text-white rounded-r-md outline-none text-sm hover:bg-primary-darkcyan/70 cursor-pointer transition-all duration-200 ease-in"
                  >
                    Add
                  </button>
                </div>

                {filteredSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                      {filteredSuggestions.map((suggestion, index) => (
                        <span
                          key={index}
                          onClick={() => addExpertise(suggestion)}
                          className="border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs cursor-pointer hover:border-primary-cyan hover:text-primary-cyan transition-all duration-150"
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <p className="font-medium mb-2">Total Experience</p>
            <div className="bg-gray-50 rounded-md p-3 flex justify-between items-center shadow-inner">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editData.yearsOfExperience}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers, max 2 digits
                      if (/^\d{0,2}$/.test(value)) {
                        const numValue = value === '' ? 0 : parseInt(value);
                        if (numValue <= 50) {
                          setEditData(prev => ({
                            ...prev,
                            yearsOfExperience: numValue
                          }));
                        }
                      }
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="0-50"
                    maxLength={2}
                  />
                  <span className="text-gray-500 text-sm">years of experience</span>
                </div>
              ) : (
                <>
                  <span className="text-gray-800 font-semibold">
                    {profileData?.profile?.yearsOfExperience || 0} Years
                  </span>
                  <span className="text-gray-500 text-sm">of total experience</span>
                </>
              )}
            </div>
          </div>

          {/* Consultation Fee */}
          <div>
            <p className="font-medium mb-2">Consultation Fee (Naira)</p>
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Minimum Fee</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₦</span>
                      <input
                        type="text"
                        value={editData.consultationFeeMin !== undefined ? editData.consultationFeeMin.toString() : ''}
                        onChange={(e) => {
                          const inputValue = e.target.value;

                          // Allow empty input
                          if (inputValue === '') {
                            setEditData(prev => ({ ...prev, consultationFeeMin: undefined }));
                            return;
                          }

                          // Only allow numeric characters
                          const numericValue = inputValue.replace(/[^0-9]/g, '');

                          if (numericValue === '') {
                            setEditData(prev => ({ ...prev, consultationFeeMin: undefined }));
                            return;
                          }

                          const value = parseInt(numericValue);

                          // Validate range
                          if (!isNaN(value) && value >= 3000 && value <= 10000000) {
                            setEditData(prev => ({
                              ...prev,
                              consultationFeeMin: value
                            }));
                          } else if (value < 3000) {
                            // Allow typing numbers less than 3000 (user might be typing)
                            setEditData(prev => ({
                              ...prev,
                              consultationFeeMin: value
                            }));
                          }
                        }}
                        onBlur={() => {
                          // On blur, enforce minimum of 3000
                          const value = editData.consultationFeeMin;
                          if (value !== undefined && value < 3000) {
                            setEditData(prev => ({
                              ...prev,
                              consultationFeeMin: 3000
                            }));
                          }
                        }}
                        placeholder="3000"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary-cyan"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Min: ₦3,000</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Maximum Fee</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₦</span>
                      <input
                        type="text"
                        value={editData.consultationFeeMax !== undefined ? editData.consultationFeeMax.toString() : ''}
                        onChange={(e) => {
                          const inputValue = e.target.value;

                          // Allow empty input
                          if (inputValue === '') {
                            setEditData(prev => ({ ...prev, consultationFeeMax: undefined }));
                            return;
                          }

                          // Only allow numeric characters
                          const numericValue = inputValue.replace(/[^0-9]/g, '');

                          if (numericValue === '') {
                            setEditData(prev => ({ ...prev, consultationFeeMax: undefined }));
                            return;
                          }

                          const value = parseInt(numericValue);
                          const minValue = editData.consultationFeeMin || 3000;

                          // Validate range
                          if (!isNaN(value) && value >= minValue && value <= 10000000) {
                            setEditData(prev => ({
                              ...prev,
                              consultationFeeMax: value
                            }));
                          } else if (value < minValue) {
                            // Allow typing numbers less than min (user might be typing)
                            setEditData(prev => ({
                              ...prev,
                              consultationFeeMax: value
                            }));
                          }
                        }}
                        onBlur={() => {
                          // On blur, enforce minimum of min value or 3000
                          const value = editData.consultationFeeMax;
                          const minValue = editData.consultationFeeMin || 3000;
                          if (value !== undefined && value < minValue) {
                            setEditData(prev => ({
                              ...prev,
                              consultationFeeMax: minValue
                            }));
                          }
                        }}
                        placeholder="100000"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary-cyan"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Must be ≥ Min</p>
                  </div>
                </div>
                {editData.consultationFeeMin && editData.consultationFeeMax && editData.consultationFeeMax < editData.consultationFeeMin && (
                  <p className="text-xs text-red-500">Maximum must be greater than or equal to minimum</p>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-md p-3 shadow-inner">
                {profileData?.profile?.consultationFeeMin && profileData?.profile?.consultationFeeMax ? (
                  <span className="text-gray-800 font-semibold">
                    ₦{profileData.profile.consultationFeeMin.toLocaleString()} - ₦{profileData.profile.consultationFeeMax.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">Not set</span>
                )}
              </div>
            )}
          </div>

          {/* Ratings */}
          <div>
            <p className="font-medium mb-2">Ratings</p>
            <div className="bg-blue-100 text-primary-cyan rounded-md p-3 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">
                  {averageRating > 0 ? `${averageRating.toFixed(1)} Stars` : 'No ratings yet'}
                </span>
              </div>
              <span className="text-sm text-primary-cyan">
                {totalReviews > 0 ? `from ${totalReviews} users` : 'No reviews yet'}
              </span>
            </div>
          </div>
        </div>

        {/* Legal Section */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Legal</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Badge Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${profileData?.profile?.badgeStatus === 'verified'
                ? 'bg-green-100 text-green-600'
                : 'bg-yellow-100 text-yellow-600'
                }`}>
                {profileData?.profile?.badgeStatus === 'verified' ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Certificate Type</span>
              <span className="text-gray-600">{profileData?.user?.certificateType || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar - Only visible when editing */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center gap-3">
            {hasProfile && (
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2.5 text-sm cursor-pointer text-gray-600 hover:text-gray-800 disabled:opacity-50 flex items-center gap-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-600/70 transition-all duration-200 ease-in cursor-pointer text-white text-sm rounded-full disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {hasProfile ? 'Save Changes' : 'Create Profile'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}