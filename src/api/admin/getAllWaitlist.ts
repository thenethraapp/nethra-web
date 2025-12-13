import apiClient from "@/api/core/apiClient";

export interface IPInfo {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  timezone?: string;
}

export interface WaitlistEntry {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phone: string;
  userType: "doctor" | "patient";
  role: "optometrist" | "patient";
  signupDate: string;
  message: string | null;
  source: string;
  isConfirmed: boolean;
  ipInfo: IPInfo | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllWaitlistResponse {
  success: boolean;
  data: WaitlistEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getAllWaitlist = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: "patient" | "optometrist";
  sortOrder?: "latest" | "earliest";
}): Promise<GetAllWaitlistResponse> => {
  try {
    const response = await apiClient.get("/api/admin/waitlist", { params });
    return response.data;
  } catch (error) {
    console.error("Get all waitlist error:", error);
    throw error;
  }
};
