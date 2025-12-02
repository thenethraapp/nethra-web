// components/providers/SocketProvider.tsx
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocketStore } from '@/store/useSocketStore';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (token) {
      console.log('🔌 Connecting socket with token...');
      connect(token);
    } else {
      console.log('🔌 Disconnecting socket - no user token');
      disconnect();
    }

    return () => {
    };
  }, [token, connect, disconnect]);

  return <>{children}</>;
};