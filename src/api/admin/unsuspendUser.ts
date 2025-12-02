import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
    unsuspendUser: process.env.ADMIN_UNSUSPEND_USER || ""
};

export const unsuspendUser = async (userId: string) => {
    try {
        const url = apiRoutes.unsuspendUser.replace(":id", userId);
        const response = await apiClient.post(url);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Unsuspend user error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to unsuspend user",
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