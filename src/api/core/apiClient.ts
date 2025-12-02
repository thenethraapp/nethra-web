// apiClient.ts - CRITICAL FIX: Auth header mismatch
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

const baseURL = process.env.API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

interface DecodedToken {
  exp: number;
  id: string;
  email: string;
  role: string;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + 5;
  } catch {
    return true;
  }
};

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  if (typeof window !== "undefined") {
    window.location.href = "/account/login";
  }
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      if (isTokenExpired(token)) {
        console.log("Token expired before request - logging out");
        handleLogout();
        return Promise.reject(new Error("Token expired"));
      }
      config.headers["authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("401 Unauthorized - logging out");
      handleLogout();
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Type-safe error message extractor
export const nextError = (e: unknown): never => {
  if (e instanceof AxiosError) {
    const errorData = e.response?.data as
      | { message?: string; error?: string }
      | undefined;
    const errorMessage =
      errorData?.message || errorData?.error || "Something went wrong";
    throw new Error(errorMessage);
  }
  throw new Error("Something went wrong");
};