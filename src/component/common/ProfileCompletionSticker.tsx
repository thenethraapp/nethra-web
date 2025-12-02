"use client";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/profile/getUserProfile";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

const ProfileCompletionSticker = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);

  // Only show for authenticated optometrists
  const isOptometrist = user?.role === "optometrist";

  const { data: profileData } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");
      const response = await getUserProfile(user.id);
      return response.data;
    },
    enabled: !!user?.id && isOptometrist,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Check if profile is incomplete (missing location, skills, or bio)
  const isProfileIncomplete = useMemo(() => {
    if (!profileData?.profile) return true;

    const hasLocation = !!profileData.profile.location;
    const hasSkills = !!profileData.profile.expertise && profileData.profile.expertise.length > 0;
    const hasBio = !!profileData.profile.about && profileData.profile.about.trim().length > 0;

    // Profile is incomplete if any of the three fields is missing
    return !hasLocation || !hasSkills || !hasBio;
  }, [profileData]);

  // Only show on feed page or home page
  const shouldShow = useMemo(() => {
    const currentPath = router.pathname;
    return currentPath === "/feed" || currentPath === "/";
  }, [router.pathname]);

  const handleCompleteProfile = () => {
    router.push("/dashboard/optometrist?tab=profile");
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  // Don't show if:
  // - User is not an optometrist
  // - Profile is complete
  // - Not on feed or home page
  // - User dismissed it
  if (!isOptometrist || !isProfileIncomplete || !shouldShow || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full sm:w-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mx-4 sm:mx-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Hey Doc, Kindly Complete Your Profile!
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Add your location, skills, and bio to appear higher in search results and help patients find you.
            </p>
            <button
              onClick={handleCompleteProfile}
              className="inline-flex items-center gap-1 text-xs font-medium bg-primary-cyan text-white transition-all duration-200 cursor-pointer rounded-full px-3 py-2"
            >
              <EditIcon sx={{ fontSize: 16 }} />
              Complete Profile
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionSticker;

