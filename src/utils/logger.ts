import { ENV } from '@/config/environment';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private prefix: string = '[Migration Hub]';

  private shouldLog(): boolean {
    return !ENV.IS_PROD || localStorage.getItem('debug') === 'true';
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    return `${this.prefix} [${level.toUpperCase()}] ${message}`;
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('error', message), ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }
}

export const logger = new Logger();