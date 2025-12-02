import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
  getAllOptometristsProfile: process.env.GET_ALL_OPTOMETRISTS_PROFILE || "",
};

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getAllOptometristsProfile = async (paginationParams?: PaginationParams) => {
  try {
    const params = new URLSearchParams();
    if (paginationParams?.page) {
      params.append("page", paginationParams.page.toString());
    }
    if (paginationParams?.limit) {
      params.append("limit", paginationParams.limit.toString());
    }
    if (paginationParams?.search && paginationParams.search.trim()) {
      params.append("search", paginationParams.search.trim());
    }

    const url = params.toString()
      ? `${apiRoutes.getAllOptometristsProfile}?${params.toString()}`
      : apiRoutes.getAllOptometristsProfile;

    const response = await apiClient.get(url);
    return { success: true, ...response.data };
  } catch (error) {
    console.error("Get All Optometrists Profile error:", error);

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
