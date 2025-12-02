import axios from "axios";
import apiClient from "../../core/apiClient";

const apiRoutes = {
    acceptBooking: process.env.ACCEPT_BOOKING || "/api/bookings/accept-booking"
}

export const acceptBooking = async (bookingId: string) => {
    try {

        const url = apiRoutes.acceptBooking.replace(":id", bookingId);
        const response = await apiClient.patch(url);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Accept booking error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to accept booking",
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