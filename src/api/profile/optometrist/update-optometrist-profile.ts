
import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
  updateOptometristProfile: process.env.UPDATE_OPTOMETRIST_PROFILE || "",
};

interface OptometristProfileData {
  photo?: string;
  about?: string;
  location?: string;
  expertise?: string[];
  yearsOfExperience?: number;
}

export const updateOptometristProfile = async (profileData: OptometristProfileData) => {
  console.log("Updating Optometrist Profile with data:", profileData);
  try {
    const response = await apiClient.patch(apiRoutes.updateOptometristProfile, profileData);
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Update Optometrist Profile error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Profile update failed",
        code: error.response.status,
      };
    }

    return { success: false, message: "Network error", code: 0 };
  }
};