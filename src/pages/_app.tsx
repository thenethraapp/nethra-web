import Head from 'next/head';
import "@/styles/globals.css";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { useMemo, memo, useEffect } from "react";
import Footer from "@/component/layout/footer";
import Navbar from "@/component/layout/navbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ReactQueryProvider from "@/lib/react-query-provider";
import { useSocketStore } from '@/store/useSocketStore';
import { SocketProvider } from '@/context/SocketProvider';
import NotificationsBar from '@/component/features/notifications/notificationsBar';
import MessagesBar from '@/component/features/messages/MessagesBar';
import { ProfileProvider } from '@/context/ProfileContext';
import { Toaster } from 'sonner';
import { useMessageToasts } from '@/hooks/useMessageToasts';

// Memoized layout wrapper to prevent unnecessary re-renders
const Layout = memo(({ children, showLayout }: { children: React.ReactNode; showLayout: boolean }) => {
  return (
    <>
      {showLayout && <Navbar />}
      {children}
      {showLayout && <Footer />}
    </>
  );
});

Layout.displayName = "Layout";

// Component that uses useAuth - must be inside AuthProvider
function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { connect, disconnect } = useSocketStore();
  const { token, user, loading } = useAuth();

  // Enable message toast notifications
  useMessageToasts();

  // Connect/disconnect socket based on token
  useEffect(() => {
    const initializeSocket = async () => {
      if (!loading && token && user) {
        console.log('🔌 Connecting socket with token for user:', user.email);
        try {
          await connect(token);
        } catch (error) {
          console.error('❌ Socket connection failed:', error);
        }
      } else if (!loading && !token) {
        console.log('🔌 No token, disconnecting socket');
        disconnect();
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [token, user, loading]); // Removed connect/disconnect from deps to avoid infinite loop

  // Memoize route check to avoid recalculating on every render
  const isAccountRoute = useMemo(() => {
    const path = router.pathname;
    return path.startsWith("/account") ||
      path.startsWith("/dashboard") ||
      path.startsWith("/message") ||
      path.startsWith("/admin") ||
      path.startsWith("/waitlist");
  }, [router.pathname]);

  const showLayout = !isAccountRoute;

  return (
    <SocketProvider>
      <Layout showLayout={showLayout}>
        <Component {...pageProps} />
      </Layout>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          className: 'message-toast',
        }}
      />
    </SocketProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>Nethra - Revolutionizing eye care in Nigeria</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PRTL4LH2JJ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PRTL4LH2JJ');
            `,
          }}
        />
      </Head>
      <ReactQueryProvider>
        <AuthProvider>
          <ProfileProvider>
            <MessagesBar />
            <NotificationsBar />
            <AppContent {...props} />
          </ProfileProvider>
        </AuthProvider>
      </ReactQueryProvider>
    </>
  );
}