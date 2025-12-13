import axios from "axios";
import apiClient from "../core/apiClient";


const apiRoutes = {
    loginUser: process.env.LOGIN || ""
}

interface LoginData {
    email: string;
    password: string;
}

export const loginUser = async (loginData: LoginData) => {
    try {
        console.log("Api Route: ", apiRoutes.loginUser)
        const response = await apiClient.post(apiRoutes.loginUser, loginData);

        // Safely access nested data structure
        const accessToken = response.data?.data?.accessToken;

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken); // ✅ save token
        }

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        // Silently handle errors - don't let them propagate to React Query's error boundary
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorMessage = error.response?.data?.message || error.message;

            // Handle 404 specifically
            if (status === 404) {
                return {
                    success: false,
                    message: "User not found. Please check your credentials.",
                    code: 404,
                };
            }

            // Handle other HTTP errors
            if (error.response) {
                return {
                    success: false,
                    message: errorMessage || "Login failed. Please try again.",
                    code: status || 0,
                };
            }

            // Handle network errors
            return {
                success: false,
                message: "Network error. Please check your connection and try again.",
                code: 0,
            };
        }

        // Handle unexpected errors
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
            code: 0,
        };
    }
};