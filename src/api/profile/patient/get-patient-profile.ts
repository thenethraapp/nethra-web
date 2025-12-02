import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
  getPatientProfile: process.env.GET_PATIENT_PROFILE || "",
};

export const getPatientProfile = async () => {
  try {
    const response = await apiClient.get(apiRoutes.getPatientProfile);
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Get Patient Profile error:", error);

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
