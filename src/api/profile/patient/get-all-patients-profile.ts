import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
  getAllPatientsProfile: process.env.GET_ALL_PATIENTS_PROFILE || "",
};

export const getAllPatientsProfile = async () => {
  try {
    const response = await apiClient.get(apiRoutes.getAllPatientsProfile);
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Get All Patients Profile error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Failed to fetch profiles",
        code: error.response.status,
      };
    }

    return { success: false, message: "Network error", code: 0 };
  }
};
