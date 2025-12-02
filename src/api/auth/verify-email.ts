import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
    verifyEmail: process.env.VERIFY_EMAIL || "",
    resendEmailVerification: process.env.RESEND_EMAIL_VERIFICATION || ""
}

export const verifyEmail = async (userId: string, code: string) => {
    try {
        const response = await apiClient.post(apiRoutes.verifyEmail, { emailVerificationCode: code, userId });

        return {
            success: true,
            message: response.data.message,
            data: response.data.data

        }

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message,
                code: error.response.status,
            };
        }

        return {
            success: false,
            message: "Network error. Please check your connection and try again.",
            code: 0,
        };
    }
}

export const resendEmailVerification = async (userId: string) => {
    try {

        const response = await apiClient.post(apiRoutes.resendEmailVerification, { userId: userId });

        return {
            success: response.data.success,
            code: response.data.code,
            message: response.data.message
        }

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data?.message,
                code: error.response.status,
            };
        }

        return {
            success: false,
            message: "Network error. Please check your connection and try again.",
            code: 0,
        };
    }
}