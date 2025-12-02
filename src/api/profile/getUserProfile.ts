import apiClient from "../core/apiClient";
import axios from "axios";

const apiRoutes = {
  getUserProfile: process.env.GET_USER_PROFILE || "",
};

export const getUserProfile = async (userId: string) => {
  try {
    const url = apiRoutes.getUserProfile.replace(":id", userId);
    const response = await apiClient.get(url);
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Get User Profile error:", error);

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