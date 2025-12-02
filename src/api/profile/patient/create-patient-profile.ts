import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
  createPatientProfile: process.env.CREATE_PATIENT_PROFILE || "",
};

interface PatientProfileData {
  gender?: string;
  dob?: Date | string;
  address?: string;
  enableLocationAccess?: boolean;
  medicalInformation?: {
    chiefComplaint?: string;
    lastEyeExamination?: Date | string;
    allergies?: string[];
    eyeConditions?: string[];
  };
  otherInformation?: {
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    emergencyContactEmail?: string;
    relationship?: string;
    consent?: boolean;
  };
}

export const createPatientProfile = async (profileData: PatientProfileData) => {
  try {
    const response = await apiClient.post(apiRoutes.createPatientProfile, profileData);
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Create Patient Profile error:", error);

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
