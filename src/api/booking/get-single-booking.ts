import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
    getSingleBooking: process.env.GET_SINGLE_BOOKING || "/api/bookings/get-single-booking"
}

export const getSingleBooking = async (bookingId: string) => {
    try {
        const response = await apiClient.get(`${apiRoutes.getSingleBooking}/${bookingId}`);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Get single booking error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to fetch booking",
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