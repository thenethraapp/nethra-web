import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
  getOptometristProfile: process.env.GET_OPTOMETRIST_PROFILE || "",
};

export const getOptometristProfile = async () => {
  try {
    const response = await apiClient.get(apiRoutes.getOptometristProfile);
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Get Optometrist Profile error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Failed to fetch profile",
        code: error.response.status,
      };
    }

    return { success: false, message: "Network error", code: 0 };
  }
};
