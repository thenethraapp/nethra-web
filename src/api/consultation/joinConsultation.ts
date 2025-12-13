import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
  joinConsultation: (roomId: string) => `/consultation/${roomId}/join`,
  getConsultation: (roomId: string) => `/consultation/${roomId}`,
};

export interface JoinConsultationResponse {
  success: boolean;
  status: "allowed" | "denied";
  message: string;
  booking?: {
    id: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: string;
    patient?: {
      id: string;
      name: string;
    };
    optometrist?: {
      id: string;
      name: string;
    };
  };
}

export const joinConsultation = async (
  roomId: string
): Promise<JoinConsultationResponse> => {
  try {
    const response = await apiClient.get(apiRoutes.joinConsultation(roomId));
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Join consultation error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        status: error.response.data?.status || "denied",
        message:
          error.response.data?.message || "Failed to join consultation",
        booking: error.response.data?.booking || undefined,
      };
    }

    return {
      success: false,
      status: "denied",
      message: "Network error",
    };
  }
};

export const getConsultationDetails = async (roomId: string) => {
  try {
    const response = await apiClient.get(apiRoutes.getConsultation(roomId));
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Get consultation error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Failed to get consultation",
      };
    }

    return { success: false, message: "Network error" };
  }
};
