// stores/useSocketStore.ts
import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket } from '@/utils/socket';

interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: (token: string) => Promise<void>;
  disconnect: () => void;
  reconnect: (token: string) => Promise<void>;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  isAuthenticated: false,
  isConnecting: false,
  error: null,
  
  connect: async (token: string) => {
    const currentSocket = get().socket;
    
    // Don't reconnect if already connected
    if (currentSocket?.connected) {
      console.log('Socket already connected');
      return;
    }

    // Don't connect if already connecting
    if (get().isConnecting) {
      console.log('Socket connection already in progress');
      return;
    }

    set({ isConnecting: true, error: null });

    try {
      console.log('Initiating socket connection...');
      const socket = await connectSocket(token); // AWAIT the promise!
      
      // Set up event listeners after connection is established
      socket.on('connect', () => {
        console.log('✅ Socket connected - Store');
        set({ isConnected: true, isConnecting: false });
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected - Store');
        set({ isConnected: false, isAuthenticated: false });
      });

      socket.on('connection_success', () => {
        console.log('✅ Socket authenticated - Store');
        set({ isAuthenticated: true });
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error - Store:', error.message);
        set({ 
          isConnected: false, 
          isAuthenticated: false,
          error: error.message 
        });
      });

      set({ 
        socket, 
        isConnected: true, 
        isConnecting: false,
        error: null 
      });

      console.log('Socket setup complete');
    } catch (error) {
      console.error('Failed to connect socket:', error);
      set({ 
        isConnecting: false, 
        error: error instanceof Error ? error.message : 'Connection failed',
        isConnected: false,
        isAuthenticated: false 
      });
    }
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      console.log('Disconnecting socket...');
      disconnectSocket();
      set({ 
        socket: null, 
        isConnected: false, 
        isAuthenticated: false,
        isConnecting: false,
        error: null 
      });
    }
  },

  reconnect: async (token: string) => {
    const { disconnect, connect } = get();
    console.log('Reconnecting socket...');
    disconnect();
    // Small delay before reconnecting
    await new Promise(resolve => setTimeout(resolve, 100));
    await connect(token);
  }
}));