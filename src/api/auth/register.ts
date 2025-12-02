import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
  registerPatient: process.env.REGISTER_PATIENT,
  registerOptometrist: process.env.REGISTER_OPTOMETRIST
}

interface PatientRegistrationData {
  email: string;
  phone: string;
  password: string;
  role: "patient";
  username: string;

  ip?: string;
  ipInfo: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    timezone?: string;
  },

}

interface OptometristRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "optometrist";
  certificateType: string;
  idNumber: string;
  expiryDate: string; // Format: YYYY-MM-DD

  ip?: string;
  ipInfo?: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    timezone?: string;
  },
}

export const registerPatient = async (
  registrationData: Omit<PatientRegistrationData, "role">
) => {
  try {

    const requestBody: PatientRegistrationData = {
      ...registrationData,
      role: "patient",
    };

    const response = await apiClient.post(
      apiRoutes.registerPatient!,
      requestBody
    );

    return {
      success: true,
      message: response.data.message || "Patient registered successfully",
      data: response.data,
    };

  } catch (error) {
    console.error("Patient registration error:", error);
    return {
      success: false,
      message:
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to register patient. Please try again later.",
    };
  }
};



export const registerOptometrist = async (
  registrationData: Omit<OptometristRegistrationData, "role" | "location">
) => {
  try {

    const requestBody = {
      ...registrationData,
      role: "optometrist",
    };

    const response = await apiClient.post(
      apiRoutes.registerOptometrist!,
      requestBody
    );

    return {
      success: true,
      message:
        response.data.message || "Optometrist registered successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Optometrist registration error:", error);
    return {
      success: false,
      message:
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to register optometrist. Please try again later.",
    };
  }
};
