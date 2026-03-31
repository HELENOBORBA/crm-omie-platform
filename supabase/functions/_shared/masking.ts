// supabase/functions/_shared/masking.ts
//
// Provides utility functions for masking sensitive data to ensure LGPD compliance in logs.
//

/**
 * Masks a string by replacing characters with a mask character,
 * leaving a specified number of characters visible at the start and end.
 * @param str The input string.
 * @param visiblePrefix Number of characters to keep at the start.
 * @param visibleSuffix Number of characters to keep at the end.
 * @param maskChar The character to use for masking.
 * @returns The masked string.
 */
const maskString = (
  str: string,
  visiblePrefix: number,
  visibleSuffix: number,
  maskChar = '*',
): string => {
  if (typeof str !== 'string' || str.length <= visiblePrefix + visibleSuffix) {
    return str;
  }
  const prefix = str.substring(0, visiblePrefix);
  const suffix = str.substring(str.length - visibleSuffix);
  const maskedPart = maskChar.repeat(str.length - (visiblePrefix + visibleSuffix));
  return `${prefix}${maskedPart}${suffix}`;
};

/**
 * Masks an email address, showing the first character of the username.
 * Example: "my.email@example.com" -> "m*******@example.com"
 * @param email The email string to mask.
 * @returns A masked email string.
 */
export const maskEmail = (email: string): string => {
  const atIndex = email.indexOf('@');
  if (atIndex <= 1) {
    return maskString(email, 1, 1);
  }
  const username = email.substring(0, atIndex);
  const domain = email.substring(atIndex);
  return `${maskString(username, 1, 0)}${domain}`;
};

/**
 * Masks a CPF or CNPJ number, showing the first 3 and last 2 digits.
 * @param doc The document number string to mask.
 * @returns A masked document number string.
 */
export const maskCpfCnpj = (doc: string): string => {
  const cleanedDoc = String(doc).replace(/\D/g, '');
  return maskString(cleanedDoc, 3, 2);
};

// Defines which keys are sensitive and which masking function to apply.
const SENSITIVE_FIELD_MASK_MAP: Record<string, (value: any) => string> = {
  email: maskEmail,
  cpf_cnpj: maskCpfCnpj,
  cpf: maskCpfCnpj,
  cnpj: maskCpfCnpj,
  telefone: (val: string) => maskString(String(val).replace(/\D/g, ''), 2, 2),
  telefone1_numero: (val: string) => maskString(String(val).replace(/\D/g, ''), 2, 2),
  contato: maskEmail, // Assuming contact can be an email
};

/**
 * Recursively traverses an object or array and masks values of sensitive keys
 * defined in `SENSITIVE_FIELD_MASK_MAP`.
 * @param data The data to process (object, array, or primitive).
 * @returns The data with sensitive fields masked.
 */
export function maskObjectData(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(maskObjectData);
  }

  const newObj: Record<string, unknown> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = (data as Record<string, unknown>)[key];
      if (SENSITIVE_FIELD_MASK_MAP[key] && typeof value === 'string' && value) {
        newObj[key] = SENSITIVE_FIELD_MASK_MAP[key](value);
      } else {
        newObj[key] = maskObjectData(value); // Recurse for nested objects/arrays
      }
    }
  }
  return newObj;
}
