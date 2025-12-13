import axios from "axios";
import apiClient from "@/api/core/apiClient";

export const createImmediateBooking = async (optometristId: string) => {
    try {
        const response = await apiClient.post("/api/bookings/create-immediate-booking", {
            optometristId
        });

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Create immediate booking error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to create immediate booking",
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


