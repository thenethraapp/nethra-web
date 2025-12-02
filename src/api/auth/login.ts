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

        const { accessToken } = response.data.data;

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken); // ✅ save token
        }

        return {
            success: true,
            ...response.data,
        };

    } catch (error) {
        console.error("Login error:", error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Login failed",
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