import axios from "axios";
import apiClient from "../core/apiClient";

const apiRoutes = {
    requestPasswordReset: process.env.REQUEST_PASSWORD_RESET,
    verifyPasswordResetOTP: process.env.VERIFY_PASSWORD_RESET_OTP,
    setNewPassword: process.env.SET_NEW_PASSWORD
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await apiClient.post(apiRoutes.requestPasswordReset!, {
            email
        });

        return {
            success: true,
            message: response.data.message || 'Password reset email sent successfully',
            data: response.data
        };
    } catch (error) {
        console.error('Request password reset error:', error);
        return {
            success: false,
            message: axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Failed to send password reset email. Please try again later.'
        };

    }
};

export const verifyPasswordResetOTP = async (
    email: string,
    otp: string
) => {
    try {
        const response = await apiClient.post(apiRoutes.verifyPasswordResetOTP!, {
            email,
            otp
        });

        return {
            success: true,
            message: response.data.message || 'OTP verified successfully',
            data: response.data
        };
    } catch (error) {
        console.error('Verify password reset OTP error:', error);
        return {
            success: false,
            message: axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Failed to verify OTP. Please try again later.'
        };
    }
};

export const setNewPassword = async (
    email: string,
    otp: string,
    newPassword: string
) => {
    try {
        const response = await apiClient.post(apiRoutes.setNewPassword!, {
            email,
            otp,
            newPassword
        });

        return {
            success: true,
            message: response.data.message || 'Password updated successfully',
            data: response.data
        };
    } catch (error) {
        console.error('Set new password error:', error);
        return {
            success: false,
            message: axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Failed to update password. Please try again later.'
        };
    }
};