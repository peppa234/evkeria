/**
 * Simple logger utility
 * In production, replace with proper logging library (Winston, Pino)
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  error?: Error;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, error, metadata } = entry;
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (error) {
      logMessage += `\nError: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        logMessage += `\nStack: ${error.stack}`;
      }
    }
    
    if (metadata && Object.keys(metadata).length > 0) {
      logMessage += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`;
    }
    
    return logMessage;
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      error,
      metadata,
    };
    console.error(this.formatMessage(entry));
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };
    console.warn(this.formatMessage(entry));
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      const entry: LogEntry = {
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        metadata,
      };
      console.info(this.formatMessage(entry));
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      const entry: LogEntry = {
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        metadata,
      };
      console.debug(this.formatMessage(entry));
    }
  }
}

export const logger = new Logger();


