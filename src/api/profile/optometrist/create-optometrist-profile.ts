import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
  createOptometristProfile: process.env.CREATE_OPTOMETRIST_PROFILE || "",
};

interface OptometristProfileData {
  photo?: string;
  about: string;
  location: string;
  expertise: string[];
  yearsOfExperience: number;
}

export const createOptometristProfile = async (profileData: OptometristProfileData) => {
  try {
    const response = await apiClient.post(apiRoutes.createOptometristProfile, profileData);
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Create Optometrist Profile error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Profile creation failed",
        code: error.response.status,
      };
    }

    return { success: false, message: "Network error", code: 0 };
  }
};