import type { NextConfig } from "next";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Detect current environment
const currentEnv = process.env.NODE_ENV === "production" ? "production" : "development";

// Pick correct file
const envFile = `.env.${currentEnv}.local`;
const envPath = path.resolve(process.cwd(), envFile);

// ✅ Load it before exporting config
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`[Nethra] Loaded environment file: ${envFile}`);
} else {
  console.warn(`[Nethra] Missing environment file: ${envFile}`);
}

console.log(`[Nethra] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[Nethra] API_BASE_URL: ${process.env.API_BASE_URL}`);

// Expose only safe variables for the browser
const publicEnv = {
  // Base URLs
  API_BASE_URL: process.env.API_BASE_URL,
  SOCKET_URL: process.env.SOCKET_URL,

  // WaitList route
  JOIN_WAITLIST: process.env.JOIN_WAITLIST,

  // Auth routes
  LOGIN: process.env.LOGIN,
  REGISTER_PATIENT: process.env.REGISTER_PATIENT,
  REGISTER_OPTOMETRIST: process.env.REGISTER_OPTOMETRIST,
  REQUEST_PASSWORD_RESET: process.env.REQUEST_PASSWORD_RESET,
  VERIFY_PASSWORD_RESET_OTP: process.env.VERIFY_PASSWORD_RESET_OTP,
  SET_NEW_PASSWORD: process.env.SET_NEW_PASSWORD,
  VERIFY_EMAIL: process.env.VERIFY_EMAIL,
  RESEND_EMAIL_VERIFICATION: process.env.RESEND_EMAIL_VERIFICATION,

  // Profile routes
  GET_USER_PROFILE: process.env.GET_USER_PROFILE,
  CREATE_OPTOMETRIST_PROFILE: process.env.CREATE_OPTOMETRIST_PROFILE,
  GET_OPTOMETRIST_PROFILE: process.env.GET_OPTOMETRIST_PROFILE,
  UPDATE_OPTOMETRIST_PROFILE: process.env.UPDATE_OPTOMETRIST_PROFILE,
  GET_ALL_OPTOMETRISTS_PROFILE: process.env.GET_ALL_OPTOMETRISTS_PROFILE,
  CREATE_PATIENT_PROFILE: process.env.CREATE_PATIENT_PROFILE,
  GET_PATIENT_PROFILE: process.env.GET_PATIENT_PROFILE,
  GET_ALL_PATIENTS_PROFILE: process.env.GET_ALL_PATIENTS_PROFILE,
  UPDATE_PATIENT_PROFILE: process.env.UPDATE_PATIENT_PROFILE,

  // Bookings
  CREATE_PATIENT_BOOKING: process.env.CREATE_PATIENT_BOOKING,
  GET_PATIENT_BOOKINGS: process.env.GET_PATIENT_BOOKINGS,
  GET_OPTOMETRIST_BOOKINGS: process.env.GET_OPTOMETRIST_BOOKINGS,
  ACCEPT_BOOKING: process.env.ACCEPT_BOOKING,
  DECLINE_BOOKING: process.env.DECLINE_BOOKING,
  GET_SINGLE_BOOKING: process.env.GET_SINGLE_BOOKING,

  // Admin
  ADMIN_GET_ALL_USERS: process.env.ADMIN_GET_ALL_USERS,
  ADMIN_GET_USER_BY_ID: process.env.ADMIN_GET_USER_BY_ID,
  ADMIN_UPDATE_USER: process.env.ADMIN_UPDATE_USER,
  ADMIN_SUSPEND_USER: process.env.ADMIN_SUSPEND_USER,
  ADMIN_UNSUSPEND_USER: process.env.ADMIN_UNSUSPEND_USER,
  ADMIN_RESET_USER_PASSWORD: process.env.ADMIN_RESET_USER_PASSWORD,
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: publicEnv,

  eslint: {
    ignoreDuringBuilds: process.env.IGNORE_BUILD_ERRORS === "true",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
