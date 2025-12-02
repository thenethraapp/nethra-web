import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
    resetUserPassword: process.env.ADMIN_RESET_USER_PASSWORD || ""
};

export const resetUserPassword = async (userId: string) => {
    try {
        const url = apiRoutes.resetUserPassword.replace(":id", userId);
        const response = await apiClient.post(url);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Reset user password error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to reset user password",
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