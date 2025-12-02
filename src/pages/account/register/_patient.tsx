"use client";
import Image from "next/image";
import React, { useState } from "react";
import { registerPatient } from "@/api/auth/register";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/router";
import LogoDark from "@/component/common/UI/LogoDark";
import Logo from "@/component/common/UI/Logo";
import PatientSignupImg from '../../../../public/images/auth/patientSignup.webp';
import { getUserIP } from "@/queries";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PatientInfo, IPData } from "@/types/api/auth";
import { useQuery, useMutation } from '@tanstack/react-query';

const RegisterPatient = () => {

    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [patientInfo, setPatientInfo] = useState<PatientInfo>({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPatientInfo({
            ...patientInfo,
            [name]: value,
        });
    };

    // Fetch IP data with react-query
    const { data: ipData } = useQuery<IPData | null>({
        queryKey: ['userIP', 'patient'],
        queryFn: getUserIP,
        staleTime: 1000 * 60 * 60, // 1 hour
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // Registration mutation
    const registrationMutation = useMutation({
        mutationFn: registerPatient,
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Registration successful!");
                router.push(`/account/verify?id=${result.data.data._id}`);
            } else {
                toast.error(result.message || "Registration failed. Please try again.");
            }
        },
        onError: (error) => {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration. Please try again.");
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!patientInfo.username || !patientInfo.email || !patientInfo.phone || !patientInfo.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (patientInfo.password !== patientInfo.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(patientInfo.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        const registrationData = {
            username: patientInfo.username,
            email: patientInfo.email,
            phone: patientInfo.phone,
            password: patientInfo.password,
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

    return (
        <div className="flex flex-col md:flex-row min-h-screen -mt-[60px]">
            {/* Left Panel - Image with Gradient */}
            <div className="hidden md:flex w-full md:w-1/2 relative overflow-hidden">
                <Image
                    src={PatientSignupImg}
                    alt="Nethra patient registration background"
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
                                📍 We can now match you with nearby doctors.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={patientInfo.username}
                                onChange={handleInputChange}
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
                                value={patientInfo.email}
                                onChange={handleInputChange}
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
                                value={patientInfo.phone}
                                onChange={handleInputChange}
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
                                    value={patientInfo.password}
                                    onChange={handleInputChange}
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
                                    value={patientInfo.confirmPassword}
                                    onChange={handleInputChange}
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
                            disabled={registrationMutation.isPending}
                            className="w-full bg-primary-cyan hover:bg-primary-darkcyan text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                        >
                            {registrationMutation.isPending ? "Registering..." : "Create Account"}
                        </button>
                    </form>

                    {/* Optometrist CTA */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 transition-all hover:shadow-md">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-primary-cyan mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-grow">
                                <p className="text-sm text-primary-blue font-medium">Are you an Optometrist?</p>
                                <p className="text-xs text-primary-blue/70 mt-1">Provide professional consultations</p>
                            </div>
                            <Link
                                href="/account/register?user=optometrist"
                                className="bg-primary-cyan text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-darkcyan transition ml-3 flex-shrink-0"
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
                </div>
            </div>
        </div>
    );
};

export default RegisterPatient;