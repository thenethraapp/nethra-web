import axios from "axios";
import apiClient from "../../core/apiClient";

const apiRoutes = {
    declineBooking: process.env.DECLINE_BOOKING || "/api/bookings/decline-booking"
}

export const declineBooking = async (bookingId: string) => {
    try {
        const url = apiRoutes.declineBooking.replace(":id", bookingId);
        const response = await apiClient.patch(url);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Decline booking error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to decline booking",
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