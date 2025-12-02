
import axios from "axios";

const apiRoutes = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  joinWaitList: process.env.NEXT_PUBLIC_JOIN_WAITLIST || "",
};

// --- Types ---
export interface IpInfo {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  timezone?: string;
}

export type WaitlistRole = "patient" | "optometrist";

export interface JoinWaitListPayload {
  role: WaitlistRole;
  fullName?: string;
  email: string;
  ipInfo?: IpInfo;
  phone?: string;
  message?: string;
}

export interface WaitlistResponse {
  success: boolean;
  code?: number;
  message: string;
}

export interface JoinWaitListPayload {
  role: "patient" | "optometrist";
  fullName?: string;
  email: string;
  ipInfo?: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    timezone?: string;
  };
  phone?: string;
  message?: string;
}

export const joinWaitList = async (payload: JoinWaitListPayload) => {
  try {
    const response = await axios.post(
      `${apiRoutes.baseURL}${apiRoutes.joinWaitList}`,
      payload
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { 
        success: false, 
        message: "Connection failed" 
      };
    }
    return { success: false, message: "An error occurred" };
  }
};