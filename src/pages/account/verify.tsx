"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LogoDark from "@/component/common/UI/LogoDark";
import Logo from "@/component/common/UI/Logo";
import PatientSignupImg from '../../../public/images/auth/patientSignup.webp';
import { resendEmailVerification, verifyEmail } from "@/api/auth/verify-email";
import AccountVerified from "@/component/common/modals/accountVerified";
import { toast } from "react-toastify";

interface VerificationError {
    message: string;
    type: 'error' | 'warning';
}

const VerifyEmail: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    // Core state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isResending, setIsResending] = useState<boolean>(false);
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [showVerifiedModal, setShowVerifiedModal] = useState<boolean>(false);

    // Timer state
    const [countdown, setCountdown] = useState<number>(90);
    const [canResend, setCanResend] = useState<boolean>(false);

    // Error handling
    const [error, setError] = useState<VerificationError | null>(null);
    const [resendMessage, setResendMessage] = useState<string>("");

    // Refs
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Validate user ID exists
    useEffect(() => {
        if (!id && typeof window !== 'undefined') {
            router.push('/account/login');
        }
    }, [id, router]);

    // Check OTP completion
    useEffect(() => {
        const filledCount = otp.filter(digit => digit !== "").length;
        setIsComplete(filledCount === 6);

        // Clear error when user starts typing
        if (filledCount > 0 && error) {
            setError(null);
        }
    }, [otp, error]);

    // Countdown timer management
    useEffect(() => {
        if (countdown > 0) {
            intervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setCanResend(true);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [countdown]);

    // Format countdown time as MM:SS
    const formatTime = useCallback((seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    // Clear error after timeout
    const clearErrorAfterTimeout = useCallback(() => {
        setTimeout(() => setError(null), 7000);
    }, []);

    // Handle OTP input changes
    const handleInputChange = (index: number, value: string) => {
        // Only allow numeric input
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value
        setOtp(newOtp);

        // Auto-focus next input if current field is filled
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }

        // Handle arrow navigation
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Handle Enter key to submit
        if (e.key === "Enter" && isComplete) {
            handleVerify(e as React.KeyboardEvent<HTMLInputElement>);
        }
    };

    // Handle paste functionality
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = new Array(6).fill("");

        for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
            newOtp[i] = pastedData[i];
        }

        setOtp(newOtp);

        // Focus the appropriate input
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    // Handle verification submission
    const handleVerify = async (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent) => {
        e.preventDefault();

        if (!isComplete || !id) return;

        setIsLoading(true);
        setError(null);

        try {
            const otpString = otp.join("");
            const result = await verifyEmail(id as string, otpString);

            if (result.success) {
                // Show success modal
                setShowVerifiedModal(true);

                // Optional: Auto-redirect after showing modal for a few seconds
                setTimeout(() => {
                    router.push('/account/login');
                }, 5000);
            } else {
                toast.error(result.message || "Verification failed. Please check your code and try again.")

                // Clear OTP on error for security
                setOtp(new Array(6).fill(""));
                inputRefs.current[0]?.focus();
                clearErrorAfterTimeout();
            }

        } catch (error) {
            console.error("Verification error:", error);
            toast.error("An unexpected error occurred. Please try again.");
            clearErrorAfterTimeout();
        } finally {
            setIsLoading(false);
        }
    };

    // Handle resend verification code
    const handleResendCode = async () => {
        if (!canResend || !id || isResending) return;

        setIsResending(true);
        setError(null);
        setResendMessage("");

        try {
            const result = await resendEmailVerification(String(id));

            if (result.success) {
                setResendMessage("Verification code sent successfully!");

                // Reset OTP and UI state
                setOtp(new Array(6).fill(""));
                inputRefs.current[0]?.focus();

                // Reset countdown
                setCountdown(90);
                setCanResend(false);

                // Clear success message after timeout
                setTimeout(() => setResendMessage(""), 3000);
            } else {
                toast.error(result.message || "Failed to send code. Please try again");
                clearErrorAfterTimeout();
            }

        } catch (error) {
            console.error("Resend error:", error)
            toast.error("Failed to resend verification code. Please try again.");

            clearErrorAfterTimeout();
        } finally {
            setIsResending(false);
        }
    };

    // Handle modal close and navigation
    const handleModalClose = () => {
        setShowVerifiedModal(false);
        router.push('/account/login');
    };

    // Don't render if no user ID
    if (!id) return null;

    return (
        <>
            {/* Account Verified Modal */}
            <AccountVerified
                isVisible={showVerifiedModal}
                onContinue={handleModalClose}
            />

            <div className="flex flex-col md:flex-row min-h-screen -mt-[60px]">
                {/* Left Panel - Image with Gradient */}
                <div className="hidden md:flex w-full md:w-1/2 relative overflow-hidden">
                    <Image
                        src={PatientSignupImg}
                        alt="Nethra email verification background"
                        fill
                        className="object-cover"
                        priority
                        quality={85}
                    />

                    {/* Gradient Overlay - Black to Transparent (Bottom to Top) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Logo and Text at Bottom Left */}
                    <div className="absolute bottom-8 left-8 z-10 flex items-center gap-6">
                        <div className="flex-shrink-0">
                            <Logo />
                        </div>
                        <div className="text-white">
                            <h1 className="text-3xl font-bold tracking-tight">WELCOME TO NETHRA</h1>
                            <p className="text-lg mt-1 text-white/90">Verify your email to continue</p>
                        </div>
                    </div>
                </div>

                {/* Mobile Logo */}
                <div className="flex sm:hidden flex-col items-center justify-center text-center pt-8">
                    <LogoDark />
                </div>

                {/* Right Panel - Verification Form */}
                <div className="flex justify-center w-full pb-12 sm:pb-0 md:w-1/2 pt-12 md:pt-0 sm:items-center sm:justify-center bg-white px-8">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-primary-blue mb-2">Verify your email</h2>
                            <p className="text-gray-600">
                                {"We've"} sent a 6-digit verification code to your email address.
                            </p>
                        </div>

                        {/* Success Message for Resend */}
                        {resendMessage && (
                            <div className="mb-6 p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200 flex items-center">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {resendMessage}
                            </div>
                        )}

                        {/* OTP Verification Form */}
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="flex justify-center gap-2 md:gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        maxLength={1}
                                        className={`w-12 h-12 md:w-14 md:h-14 text-center text-xl font-semibold border-2 rounded-lg 
                                            focus:outline-none focus:ring-2 transition-all
                                            ${error
                                                ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
                                                : 'border-gray-300 focus:ring-primary-cyan focus:border-primary-cyan'
                                            }`}
                                        autoComplete="off"
                                        disabled={isLoading}
                                        aria-label={`Digit ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={!isComplete || isLoading}
                                className="w-full bg-primary-cyan hover:bg-primary-darkcyan text-white py-3 rounded-lg font-semibold 
                                    transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                                    disabled:hover:shadow-md flex items-center justify-center cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Email"
                                )}
                            </button>
                        </form>

                        {/* Resend Code Section */}
                        <div className="mt-8 text-center">
                            {canResend ? (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {"Didn't"} receive the code?
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={isResending}
                                        className="text-primary-cyan hover:text-primary-darkcyan text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isResending ? "Sending..." : "Resend verification code"}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-2">Code expires in</p>
                                    <span className="font-mono text-2xl font-bold text-primary-cyan">
                                        {formatTime(countdown)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Want to use a different email?{" "}
                            <Link
                                href="/account/login"
                                className="text-primary-cyan hover:text-primary-darkcyan font-medium transition"
                            >
                                Back to login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyEmail;