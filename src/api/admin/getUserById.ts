import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
    getUserById: process.env.ADMIN_GET_USER_BY_ID || ""
};

export const getUserById = async (userId: string) => {
    try {
        const url = apiRoutes.getUserById.replace(":id", userId);
        const response = await apiClient.get(url);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Get user by ID error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to fetch user",
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