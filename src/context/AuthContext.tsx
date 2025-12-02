import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  role: string;
  fullName: string;
  hasCompletedProfile?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface DecodedProps {
  id: string;
  email: string;
  role: string;
  fullName: string;
  hasCompletedProfile: boolean;
  exp: number; // JWT expiration timestamp
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const redirectInProgress = useRef(false);
  const expirationCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Routes that are accessible to everyone (logged in or not)
  const publicRoutes = [
    "/",
    "/privacy-policy",
    "/terms",
    "/contact",
    "/about-us",
    "/feed",
    "/shop-eyewears",
    "/partner",
    "/waitlist"
  ];

  const authRoutes = [
    "/account/login",
    "/account/verify",
    "/account/register",
    "/account/forgot-password",
    "/zohoverify"
  ];

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedProps = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (err) {
      console.error("Error decoding token:", err);
      return true;
    }
  };

  // Clear auth data and redirect to login
  const handleTokenExpiration = () => {
    console.log("Token expired - logging out");
    localStorage.removeItem("accessToken");
    setUser(null);
    setToken(null);

    // Clear the interval
    if (expirationCheckInterval.current) {
      clearInterval(expirationCheckInterval.current);
      expirationCheckInterval.current = null;
    }

    // Only redirect if not already on an auth or public route
    const isPublicRoute = publicRoutes.includes(router.pathname);
    const isAuthRoute = authRoutes.includes(router.pathname);

    if (!isPublicRoute && !isAuthRoute && !redirectInProgress.current) {
      redirectInProgress.current = true;
      router.replace("/account/login").finally(() => {
        redirectInProgress.current = false;
      });
    }
  };

  // Set up periodic token expiration check
  const setupExpirationCheck = (token: string) => {
    // Clear any existing interval
    if (expirationCheckInterval.current) {
      clearInterval(expirationCheckInterval.current);
    }

    // Check immediately
    if (isTokenExpired(token)) {
      handleTokenExpiration();
      return;
    }

    // Check every minute
    expirationCheckInterval.current = setInterval(() => {
      const storedToken = localStorage.getItem("accessToken");
      if (!storedToken || isTokenExpired(storedToken)) {
        handleTokenExpiration();
      }
    }, 60000); // Check every 60 seconds
  };

  // Hydrate user on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      // Check if token is expired
      if (isTokenExpired(storedToken)) {
        console.log("Stored token is expired");
        localStorage.removeItem("accessToken");
        setLoading(false);
        return;
      }

      try {
        const decoded: DecodedProps = jwtDecode(storedToken);
        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          fullName: decoded.fullName,
          hasCompletedProfile: decoded.hasCompletedProfile
        });
        setToken(storedToken);

        // Set up expiration checking
        setupExpirationCheck(storedToken);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("accessToken");
      }
    }
    setLoading(false);

    // Cleanup interval on unmount
    return () => {
      if (expirationCheckInterval.current) {
        clearInterval(expirationCheckInterval.current);
      }
    };
  }, []);

  const login = (newToken: string) => {
    // Check if new token is already expired
    if (isTokenExpired(newToken)) {
      console.error("Cannot login with expired token");
      return;
    }

    localStorage.setItem("accessToken", newToken);
    setToken(newToken);

    try {
      const decoded: DecodedProps = jwtDecode(newToken);
      console.log("Decoded token:", decoded);
      setUser({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        fullName: decoded.fullName,
        hasCompletedProfile: decoded.hasCompletedProfile
      });

      // Set up expiration checking for new token
      setupExpirationCheck(newToken);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setToken(null);

    // Clear the interval
    if (expirationCheckInterval.current) {
      clearInterval(expirationCheckInterval.current);
      expirationCheckInterval.current = null;
    }

    router.push("/account/login");
  };

  // Global route guard
  useEffect(() => {
    if (loading || redirectInProgress.current) return;

    const isPublicRoute = publicRoutes.includes(router.pathname);
    const isAuthRoute = authRoutes.includes(router.pathname);

    // If user is NOT logged in and tries to access protected route
    if (!user && !isPublicRoute && !isAuthRoute) {
      redirectInProgress.current = true;
      router.replace("/account/login").finally(() => {
        redirectInProgress.current = false;
      });
      return;
    }

    // If user IS logged in and tries to access auth routes (login, register, forgot-password)
    if (user && isAuthRoute) {
      redirectInProgress.current = true;
      if (user.role === "optometrist") {
        router.replace("/dashboard").finally(() => {
          redirectInProgress.current = false;
        });
      } else {
        router.replace("/feed").finally(() => {
          redirectInProgress.current = false;
        });
      }
    }
  }, [user, loading, router.pathname]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}