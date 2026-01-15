export const SOCKET_CONFIG = {
  // url: process.env.NEXT_PUBLIC_SOCKET_URL || 'https://nimble-backend-qfg0.onrender.com' || 'http://localhost:4000',
  url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  options: {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }
};