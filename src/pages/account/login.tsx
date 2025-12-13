import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import Logo from "@/component/common/UI/Logo";
import { memo, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { loginUser } from "@/api/auth/login";
import LogoDark from "@/component/common/UI/LogoDark";
import { useAuth } from "@/context/AuthContext";
import ScreenImg from "../../../public/images/auth/login.webp";
import { useMutation } from '@tanstack/react-query';
import Head from 'next/head';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message?: string;
    code?: number;
    data?: {
        accessToken?: string;
        isEmailVerified: boolean;
        role: 'admin' | 'superadmin' | 'optometrist' | 'patient';
        _id: string;
    };
}

// Email regex constant (moved outside component)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Memoized SVG icons to prevent re-renders
const PatientIcon = memo(() => (
    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
));
PatientIcon.displayName = 'PatientIcon';

const OptometristIcon = memo(() => (
    <svg className="w-5 h-5 text-primary-cyan mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
));
OptometristIcon.displayName = 'OptometristIcon';

// Memoized CTA card component
const RegistrationCTA = memo(({
    type,
    title,
    subtitle,
    bgColor,
    borderColor,
    textColor,
    buttonBg,
    buttonHover,
    Icon
}: {
    type: string;
    title: string;
    subtitle: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    buttonBg: string;
    buttonHover: string;
    Icon: React.ComponentType;
}) => (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4 transition-all hover:shadow-md`}>
        <div className="flex items-center">
            <Icon />
            <div className="flex-grow">
                <p className={`text-sm ${textColor} font-medium`}>{title}</p>
                <p className={`text-xs ${textColor}/70 mt-1`}>{subtitle}</p>
            </div>
            <Link
                href={`/account/register?user=${type}`}
                className={`${buttonBg} text-white px-4 py-2 rounded-lg text-sm font-medium ${buttonHover} transition ml-3 flex-shrink-0`}
            >
                Register
            </Link>
        </div>
    </div>
));
RegistrationCTA.displayName = 'RegistrationCTA';

const Login = () => {
    const router = useRouter();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: "",
        password: "",
    });

    // React Query mutation for login
    const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: loginUser,
        onSuccess: (result) => {
            if (result.success && result.data) {
                toast.success("Login successful!");

                if (result.data.accessToken) {
                    login(result.data.accessToken);
                }

                // Handle navigation based on verification and role
                if (result.data.isEmailVerified === false) {
                    router.push(`/account/verify?role=${result.data.role}&id=${result.data._id}`);
                    return;
                }

                const roleRoutes = {
                    admin: '/admin',
                    superadmin: '/admin',
                    optometrist: '/dashboard',
                    patient: '/feed'
                } as const;

                const route = roleRoutes[result.data.role];
                if (route) {
                    router.push(route);
                }
            } else {
                // Handle different error codes with appropriate messages
                if (result.code === 404) {
                    toast.error("User not found. Please check your credentials.");
                } else if (result.code === 401 || result.code === 400) {
                    toast.error("Incorrect email or password");
                } else {
                    toast.error(result.message || "Login failed. Please try again.");
                }
            }
        },
        onError: (error) => {
            // This should rarely be called since loginUser catches all errors
            // But handle it gracefully just in case
            console.error("Unexpected login error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        },
        // Prevent React Query from throwing errors to error boundary
        throwOnError: false,
    });

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: name === 'email' ? value.toLowerCase() : value,
        }));
    }, []);

    // Memoized password toggle
    const togglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    // Memoized submit handler
    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Basic validation
        if (!credentials.email || !credentials.password) {
            toast.error("Please fill in all fields");
            return;
        }

        // Email validation
        if (!EMAIL_REGEX.test(credentials.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        loginMutation.mutate(credentials);

    }, [credentials, loginMutation]);

    const isLoading = loginMutation.isPending;

    return (
        <>
            <Head>
                <title>Login - Nethra Eye Care Platform</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
            </Head>

            <div className="flex flex-col md:flex-row min-h-screen -mt-[60px]">
                {/* Left Side - Image with Gradient and Logo */}
                <div className="hidden md:flex w-full md:w-1/2 relative overflow-hidden">
                    <Image
                        src={ScreenImg}
                        alt="Nethra eye care authentication background with modern medical interface"
                        fill
                        className="object-cover"
                        priority
                        quality={85}
                        placeholder="blur"
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
                            <p className="text-lg mt-1 text-white/90">Login to explore your vision care</p>
                        </div>
                    </div>
                </div>

                {/* Mobile Logo */}
                <div className="flex sm:hidden flex-col items-center justify-center text-center pt-8">
                    <LogoDark />
                </div>

                {/* Right Side - Login Form */}
                <div className="flex justify-center w-full pb-12 sm:pb-0 md:w-1/2 pt-12 md:pt-0 sm:items-center sm:justify-center bg-white px-8">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-primary-blue mb-2">Welcome Back</h2>
                            <p className="text-gray-600">Login to continue to your account</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                    aria-label="Email address"
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
                                        value={credentials.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="current-password"
                                        aria-label="Password"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:border-transparent transition"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                                        onClick={togglePassword}
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

                            <div className="flex items-center justify-end">
                                <Link
                                    href="/account/forgot-password"
                                    className="text-sm text-primary-cyan hover:text-primary-darkcyan font-medium transition"
                                    aria-label="Reset your password"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                aria-busy={isLoading}
                                className="w-full bg-primary-cyan cursor-pointer hover:bg-primary-darkcyan text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        {/* Registration CTAs */}
                        <div className="mt-8 space-y-3">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">
                                        {"Don't"} have an account?
                                    </span>
                                </div>
                            </div>

                            {/* Patient Registration CTA */}
                            <RegistrationCTA
                                type="patient"
                                title="Looking for Eye Care Services?"
                                subtitle="Find and consult with optometrists"
                                bgColor="bg-green-50"
                                borderColor="border-green-200"
                                textColor="text-green-800"
                                buttonBg="bg-green-600"
                                buttonHover="hover:bg-green-700"
                                Icon={PatientIcon}
                            />

                            {/* Optometrist Registration CTA */}
                            <RegistrationCTA
                                type="optometrist"
                                title="Are you an Optometrist?"
                                subtitle="Provide professional consultations"
                                bgColor="bg-blue-50"
                                borderColor="border-blue-200"
                                textColor="text-primary-blue"
                                buttonBg="bg-primary-cyan"
                                buttonHover="hover:bg-primary-darkcyan"
                                Icon={OptometristIcon}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(Login);