import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
    getPatientBookings: process.env.GET_PATIENT_BOOKINGS || "/api/bookings/get-patient-bookings"
}

export const getPatientBookings = async () => {
    try {
        const response = await apiClient.get(apiRoutes.getPatientBookings);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Get patient bookings error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to fetch patient bookings",
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