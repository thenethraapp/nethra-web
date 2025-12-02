import axios from "axios";
import apiClient from "@/api/core/apiClient";

const apiRoutes = {
    createPatientBooking: process.env.CREATE_PATIENT_BOOKING || "/api/bookings/create-patient-booking"
}

interface BookingData {
    optometrist: string;
    bookingType: "in-person" | "virtual";
    appointmentDate: string; // YYYY-MM-DD format
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    reason: string;
}

export const createPatientBooking = async (bookingData: BookingData) => {
    try {
        const response = await apiClient.post(apiRoutes.createPatientBooking, bookingData);

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Create patient booking error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Failed to create booking",
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