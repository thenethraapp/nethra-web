import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
    suspendUser: process.env.ADMIN_SUSPEND_USER || ""
};

export const suspendUser = async (userId: string) => {
    try {
        const url = apiRoutes.suspendUser.replace(":id", userId);
        const response = await apiClient.post(url);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Suspend user error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to suspend user",
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