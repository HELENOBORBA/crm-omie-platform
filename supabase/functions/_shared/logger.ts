/**
 * @file Centralized logger with automatic data masking for production.
 * This logger ensures that sensitive data is not exposed in production logs.
 */

import { maskData } from './masking.ts';

// Determines if the current environment is production.
const isProduction = Deno.env.get('ENV') === 'production';

// Helper to stringify objects, handling circular references.
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  };
};

/**
 * Core logging function.
 * @param level The log level ('INFO', 'WARNING', 'ERROR').
 * @param message The log message.
 * @param data Optional data object to log. Will be masked in production.
 */
const log = (level: 'INFO' | 'WARNING' | 'ERROR', message: string, data?: object) => {
  // In production, mask the data before logging.
  // In other environments, log the raw data for easier debugging.
  const dataToLog = isProduction ? maskData(data) : data;

  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data: dataToLog,
  };

  // Use console.error for ERROR level to ensure it goes to stderr.
  if (level === 'ERROR') {
    console.error(JSON.stringify(logEntry, getCircularReplacer()));
  } else {
    console.log(JSON.stringify(logEntry, getCircularReplacer()));
  }
};

/**
 * A simple logger instance with different levels.
 * It automatically masks sensitive data in production environments.
 */
export const logger = {
  info: (message: string, data?: object) => {
    log('INFO', message, data);
  },
  warn: (message: string, data?: object) => {
    log('WARNING', message, data);
  },
  error: (message: string, error?: any, data?: object) => {
    // Combine provided data with error information for a complete log.
    const errorData = {
      ...data,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    };
    log('ERROR', message, errorData);
  },
};
