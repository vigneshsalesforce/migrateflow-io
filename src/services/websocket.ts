import { ENV } from '@/config/environment';
import { logger } from '@/utils/logger';
import { WEBSOCKET_EVENTS } from '@/constants';

type WebSocketCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, WebSocketCallback[]> = new Map();

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(ENV.WS_URL);

    this.socket.onopen = () => {
      logger.info('WebSocket connected');
      this.emit(WEBSOCKET_EVENTS.CONNECT, {});
    };

    this.socket.onclose = () => {
      logger.info('WebSocket disconnected');
      this.emit(WEBSOCKET_EVENTS.DISCONNECT, {});
    };

    this.socket.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        this.emit(type, data);
      } catch (error) {
        logger.error('Failed to parse WebSocket message', error);
      }
    };
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
  }

  on(event: string, callback: WebSocketCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: WebSocketCallback): void {
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }
}

export const wsService = new WebSocketService();