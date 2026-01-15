import { io, Socket } from 'socket.io-client';
import { SOCKET_CONFIG } from '@/app/lib/config/socket';

class SocketService {
  private socket: Socket | null = null;

  init(userId: string): Socket {
    if (!this.socket) {
      console.log('🔌 Initializing socket connection to:', SOCKET_CONFIG.url);
      
      this.socket = io(SOCKET_CONFIG.url, {
        ...SOCKET_CONFIG.options,
        query: {
          userId: userId
        }
      });

      this.setupEventListeners();
    }

    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully. ID:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error.message);
      console.log('🔴 Attempting to connect to:', SOCKET_CONFIG.url);
    });

    this.socket.on('error', (error) => {
      console.error('🔴 Socket error:', error);
    });
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Helper method to check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create a singleton instance
export const socketService = new SocketService();

// Export the init function for backward compatibility
export const initSocket = (userId: string): Socket => {
  return socketService.init(userId);
};

export const getSocket = (): Socket | null => {
  return socketService.getSocket();
};

export const disconnectSocket = (): void => {
  socketService.disconnect();
};