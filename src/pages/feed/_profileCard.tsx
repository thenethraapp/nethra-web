import CloudinaryImage from "@/component/common/UI/CloudinaryImage";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import UserAvatar from "@/component/common/UI/UserAvatar";
import { ProfileCardProps } from "@/types/domain/feed";
import React, { memo, useCallback } from "react";
import ExpertiseChip from "./_expertiseChip";
import { MdVerified } from "react-icons/md";
import StarRating from "./_starRating";

const ProfileCard = memo<ProfileCardProps>(
  ({ optometrist, onViewProfile }) => {
    const handleClick = useCallback(() => {
      if (optometrist?.user) {
        onViewProfile(optometrist.user.id);
      }
    }, [onViewProfile, optometrist?.user]);

    if (!optometrist?.user) {
      return null; // or <p>User data not available</p>
    }

    const { user, profile } = optometrist;

    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer hover:border-primary-cyan transition-all duration-200 ease-in flex flex-col justify-between">
        <article>
          <div className="flex items-start gap-4 mb-4">
            {user.photo ? (
              <CloudinaryImage
                src={user.photo}
                alt={user.fullName}
                width={64}
                height={64}
                fallbackSrc="/icons/avatar.png"
              />
            ) : (
              <UserAvatar />
            )}

            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <span className="text-xs font-medium text-primary-blue">
                  <MdVerified size={20} />
                </span>
                <span>{user.fullName}</span>
              </h3>

              <p className="text-sm text-gray-600">{user.certificateType}</p>
              <StarRating />
            </div>
          </div>

          {profile ? (
            <>
              {profile.location && (
                <div className="flex items-center gap-2 mb-2">
                  <LocationPinIcon className="text-[#4FD9B3] text-base" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}

              {profile.about && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {profile.about}
                </p>
              )}

              {profile.expertise && profile.expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.expertise
                    .slice(profile.expertise.length - 2, profile.expertise.length)
                    .map((skill, i) => (
                      <ExpertiseChip key={i} expertise={skill} />
                    ))}

                  {profile.expertise.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{profile.expertise.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">Missing Profile</p>
          )}
        </article>

        <button
          onClick={handleClick}
          className="w-full text-center bg-primary-cyan text-white px-4 py-2 rounded-full hover:bg-primary-cyan/70 cursor-pointer transition-all duration-200 ease-in"
          type="button"
        >
          View Profile
        </button>
      </div>
    );
  },
  (prev, next) =>
    prev.optometrist.user.id === next.optometrist.user.id &&
    prev.optometrist.user.photo === next.optometrist.user.photo &&
    prev.optometrist.user.fullName === next.optometrist.user.fullName
);

ProfileCard.displayName = "ProfileCard";

export default ProfileCard;
