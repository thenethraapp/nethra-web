import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
  updatePatientProfile: process.env.UPDATE_PATIENT_PROFILE || "",
};

interface PatientProfileData {
  location?: string;
  profilePhoto?: string;
}

export const updatePatientProfile = async (profileData: PatientProfileData) => {
  try {
    const response = await apiClient.patch(apiRoutes.updatePatientProfile, profileData);
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Update Patient Profile error:", error);

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