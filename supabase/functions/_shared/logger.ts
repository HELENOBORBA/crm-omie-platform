// supabase/functions/_shared/logger.ts
//
// Provides LGPD-compliant logging functions that automatically mask sensitive data.
// Use these functions instead of `console.log` or `console.error` when handling
// user or sensitive data.
//
import { maskObjectData } from './masking.ts';

/**
 * A helper to pretty-print an object to a string, ensuring it's masked.
 * @param data The data to stringify.
 * @returns A JSON string representation of the masked data.
 */
const stringifyAndMask = (data: unknown): string => {
  try {
    return JSON.stringify(maskObjectData(data), null, 2);
  } catch (e) {
    return '[Logger Error: Could not stringify and mask data]';
  }
};

/**
 * Logs an informational message. Any provided data object will be masked.
 * @param message The message to log.
 * @param data Optional data object to include in the log.
 */
export const logInfo = (message: string, data?: unknown) => {
  if (data) {
    console.log(`[INFO] ${message}`, stringifyAndMask(data));
  } else {
    console.log(`[INFO] ${message}`);
  }
};

/**
 * Logs an error message. Any provided error or data object will be masked.
 * @param message The error message to log.
 * @param error Optional error or data object to include in the log.
 */
export const logError = (message: string, error?: unknown) => {
  if (error) {
    console.error(`[ERROR] ${message}`, stringifyAndMask(error));
  } else {
    console.error(`[ERROR] ${message}`);
  }
};

export const logger = {
  info: logInfo,
  error: logError,
};
