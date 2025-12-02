import axios from "axios";
import apiClient from "../../core/apiClient";

const apiRoutes = {
    getAllOptometristBookings: process.env.GET_OPTOMETRIST_BOOKINGS || "/api/bookings/get-all-optometrist-bookings"
}

export const getAllOptometristBookings = async () => {
    try {
        const response = await apiClient.get(apiRoutes.getAllOptometristBookings);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Get optometrist bookings error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to fetch optometrist bookings",
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