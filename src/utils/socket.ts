// utils/socket.ts
import { Socket, io } from 'socket.io-client';

let socket: Socket | null = null;
let connectionPromise: Promise<Socket> | null = null;

export function connectSocket(token: string): Promise<Socket> {
  // Return existing connection promise if already connecting
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = new Promise((resolve, reject) => {
    // Clean up existing socket
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    socket = io(process.env.SOCKET_URL as string, {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    const connectTimeout = setTimeout(() => {
      reject(new Error('Socket connection timeout'));
      connectionPromise = null;
    }, 10000);

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);
      clearTimeout(connectTimeout);
      resolve(socket!);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      clearTimeout(connectTimeout);
      reject(error);
      connectionPromise = null;
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, might need to reconnect with new auth
        setTimeout(() => {
          if (socket && token) {
            socket.auth = { token };
            socket.connect();
          }
        }, 1000);
      }
    });

    socket.on('connection_success', () => {
      console.log('✅ Socket authentication successful');
    });
  });

  return connectionPromise;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  connectionPromise = null;
}

// Helper to ensure socket is ready
export async function ensureSocketConnection(token: string): Promise<Socket> {
  const currentSocket = getSocket();
  if (currentSocket?.connected) {
    return currentSocket;
  }
  return connectSocket(token);
}