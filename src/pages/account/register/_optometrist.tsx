"use client";
import Image from "next/image";
import React, { useState } from "react";
import OptometristSignupImg from '../../../../public/images/auth/optometristSignup.webp';
import { registerOptometrist } from "@/api/auth/register";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/router";
import LogoDark from "@/component/common/UI/LogoDark";
import Logo from "@/component/common/UI/Logo";
import { getUserIP } from "@/queries";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BasicInfo, Credentials, IPData } from "@/types/api/auth";
import { useQuery, useMutation } from '@tanstack/react-query';

const RegisterOptometrist = () => {
    const router = useRouter();
    const [currentPhase, setCurrentPhase] = useState<1 | 2>(1);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // Phase 1 data
    const [basicInfo, setBasicInfo] = useState<BasicInfo>({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    // Phase 2 data
    const [credentials, setCredentials] = useState<Credentials>({
        certificateType: "",
        idNumber: "",
        expiryDate: "",
    });

    const { data: ipData } = useQuery<IPData | null>({
        queryKey: ['userIP', 'optometrist'],
        queryFn: getUserIP,
        staleTime: 1000 * 60 * 60, // 1 hour
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // Registration mutation
    const registrationMutation = useMutation({
        mutationFn: registerOptometrist,
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Registration successful!");
                router.push(`/account/verify?id=${result.data.data._id}`);
                setBasicInfo({
                    fullName: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: ""
                });
                setCredentials({
                    certificateType: "",
                    idNumber: "",
                    expiryDate: ""
                });
            } else {
                toast.error(result.message || "Registration failed. Please try again.");
            }
        },
        onError: (error) => {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration. Please try again.");
        }
    });

    const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBasicInfo({
            ...basicInfo,
            [name]: value,
        });
    };

    const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const handlePhase1Submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!basicInfo.fullName || !basicInfo.email || !basicInfo.phone || !basicInfo.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (basicInfo.password !== basicInfo.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(basicInfo.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setCurrentPhase(2);
    };

    const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!credentials.certificateType || !credentials.idNumber || !credentials.expiryDate) {
            toast.error("Please fill in all credential fields");
            return;
        }

        const registrationData = {
            fullName: basicInfo.fullName,
            email: basicInfo.email,
            phone: basicInfo.phone,
            password: basicInfo.password,
            certificateType: credentials.certificateType,
            idNumber: credentials.idNumber,
            expiryDate: credentials.expiryDate,
            ip: ipData?.ip,
            ipInfo: {
                ip: ipData?.ip || '',
                city: ipData?.city || '',
                region: ipData?.region || '',
                country: ipData?.country || '',
                loc: ipData?.loc || '',
                timezone: ipData?.timezone || '',
            },
        };

        registrationMutation.mutate(registrationData);
    };

    const goBackToPhase1 = () => {
        setCurrentPhase(1);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen -mt-[60px]">
            {/* Left Panel - Image with Gradient */}
            <div className="hidden md:flex w-full md:w-1/2 relative overflow-hidden">
                <Image
                    src={OptometristSignupImg}
                    alt="Nethra optometrist registration background"
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
                        <p className="text-lg mt-1 text-white/90">Register to get started</p>
                    </div>
                </div>
            </div>

            {/* Mobile Logo */}
            <div className="flex sm:hidden flex-col items-center justify-center text-center pt-8">
                <LogoDark />
            </div>

            {/* Right Panel - Registration Form */}
            <div className="flex justify-center w-full pb-12 sm:pb-0 md:w-1/2 pt-12 md:pt-0 sm:items-center sm:justify-center bg-white px-8">
                <div className="w-full max-w-md">
                    {currentPhase === 1 ? (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-primary-blue mb-2">Create your account!</h2>
                                <p className="text-gray-600">Enter your full details to get started</p>
                            </div>

                            {ipData && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-start">
                                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-green-700">
                                        📍 {"We'll"} match you with nearby patients.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handlePhase1Submit} className="space-y-5">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        value={basicInfo.fullName}
                                        onChange={handleBasicInfoChange}
                                        placeholder="Enter your full name"
                                        required
                                        autoComplete="name"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={basicInfo.email}
                                        onChange={handleBasicInfoChange}
                                        placeholder="Enter your email"
                                        required
                                        autoComplete="email"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={basicInfo.phone}
                                        onChange={handleBasicInfoChange}
                                        placeholder="Enter your mobile number"
                                        required
                                        autoComplete="tel"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={basicInfo.password}
                                            onChange={handleBasicInfoChange}
                                            placeholder="Create a password"
                                            required
                                            autoComplete="new-password"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <VisibilityOffIcon sx={{ fontSize: 20 }} />
                                            ) : (
                                                <VisibilityIcon sx={{ fontSize: 20 }} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={basicInfo.confirmPassword}
                                            onChange={handleBasicInfoChange}
                                            placeholder="Confirm your password"
                                            required
                                            autoComplete="new-password"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOffIcon sx={{ fontSize: 20 }} />
                                            ) : (
                                                <VisibilityIcon sx={{ fontSize: 20 }} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary-cyan hover:bg-primary-darkcyan text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    Continue
                                </button>
                            </form>

                            {/* Patient CTA */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6 transition-all hover:shadow-md">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-grow">
                                        <p className="text-sm text-green-800 font-medium">Looking for Eye Care Services?</p>
                                        <p className="text-xs text-green-700/70 mt-1">Find and consult with optometrists</p>
                                    </div>
                                    <Link
                                        href="/account/register?user=patient"
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition ml-3 flex-shrink-0"
                                    >
                                        Register
                                    </Link>
                                </div>
                            </div>

                            <p className="text-center text-sm text-gray-600 mt-6">
                                Already have an account?{" "}
                                <Link href="/account/login" className="text-primary-cyan hover:text-primary-darkcyan font-medium transition">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center mb-8">
                                <button
                                    type="button"
                                    onClick={goBackToPhase1}
                                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition"
                                    aria-label="Go back to previous step"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div>
                                    <h2 className="text-3xl font-bold text-primary-blue">Upload your credentials</h2>
                                    <p className="text-gray-600 text-sm mt-1">Verify your professional qualifications</p>
                                </div>
                            </div>

                            <form onSubmit={handleFinalSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="certificateType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Certificate Type
                                    </label>
                                    <select
                                        id="certificateType"
                                        name="certificateType"
                                        value={credentials.certificateType}
                                        onChange={handleCredentialsChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition bg-white"
                                    >
                                        <option value="">Select Certificate Type</option>
                                        <option value="Doctor of Optometry (OD)">Doctor of Optometry (OD)</option>
                                        <option value="none">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        License/Registration ID Number
                                    </label>
                                    <input
                                        id="idNumber"
                                        type="text"
                                        name="idNumber"
                                        value={credentials.idNumber}
                                        onChange={handleCredentialsChange}
                                        placeholder="Enter your license number"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                                        Certificate Expiry Date
                                    </label>
                                    <input
                                        id="expiryDate"
                                        type="date"
                                        name="expiryDate"
                                        value={credentials.expiryDate}
                                        onChange={handleCredentialsChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={registrationMutation.isPending}
                                    className="w-full bg-primary-cyan hover:bg-primary-darkcyan cursor-pointer text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                                >
                                    {registrationMutation.isPending ? "Registering..." : "Complete Registration"}
                                </button>
                            </form>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-primary-cyan mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-primary-blue font-medium">Verification Required</p>
                                        <p className="text-xs text-primary-blue/70 mt-1">Your credentials will be verified by our team before account activation.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterOptometrist;