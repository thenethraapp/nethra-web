import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
    getAllUsers: process.env.ADMIN_GET_ALL_USERS || ""
};

interface GetAllUsersParams {
    role?: "patient" | "optometrist";
    isEmailVerified?: boolean;
    page?: number;
    limit?: number;
}

export const getAllUsers = async (params?: GetAllUsersParams) => {
    try {
        const response = await apiClient.get(apiRoutes.getAllUsers, { params });

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Get all users error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to fetch users",
                code: error.response.status,
            };
        }

        return {
            success: false,
            message: "Network error. Please check your connection and try again.",
            code: 0,
        };
    }
};