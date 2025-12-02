import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
    updateUser: process.env.ADMIN_UPDATE_USER || ""
};

interface UpdateUserData {
    email?: string;
    phone?: string;
    username?: string;
    fullName?: string;
    role?: "patient" | "optometrist";
    isEmailVerified?: boolean;
}

export const updateUser = async (userId: string, updateData: UpdateUserData) => {
    try {
        const url = apiRoutes.updateUser.replace(":id", userId);
        const response = await apiClient.put(url, updateData);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Update user error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to update user",
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