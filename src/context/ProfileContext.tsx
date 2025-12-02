import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { getUserProfile } from "@/api/profile/getUserProfile";
import { ProfileData } from "@/types/domain/optometrist";

interface ProfileContextType {
  profileData: ProfileData | null;
  isLoading: boolean;
  isProfileIncomplete: boolean;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");
      const response = await getUserProfile(user.id);
      return response.data as ProfileData;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const isProfileIncomplete = useMemo(() => {
    return data?.profile?.expertise?.length === 0;
  }, [data?.profile?.expertise]);

  const refreshProfile = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <ProfileContext.Provider
      value={{
        profileData: data || null,
        isLoading,
        isProfileIncomplete,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
};
