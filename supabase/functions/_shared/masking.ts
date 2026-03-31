/**
 * @file Centralized data masking utilities for LGPD compliance.
 * This file provides functions to mask sensitive data before logging or storage.
 */

/**
 * Masks a string by replacing characters with a mask character,
 * leaving a specified number of characters visible at the start and end.
 * @param str The input string.
 * @param visiblePrefix Number of characters to keep at the start.
 * @param visibleSuffix Number of characters to keep at the end.
 * @param maskChar The character to use for masking.
 * @returns The masked string.
 */
const maskStringInternal = (
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
 * Masks a string value, showing only a few characters.
 * @param value The string to mask.
 * @returns The masked string.
 */
export function maskString(value: string | null | undefined): string {
  if (!value) return '***';
  if (value.length <= 4) return '****';
  return `${value.substring(0, 3)}***`;
}

/**
 * Masks an email address, showing the first character of the username.
 * Example: "my.email@example.com" -> "m*******@example.com"
 * @param email The email string to mask.
 * @returns A masked email string.
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return '***';
  const atIndex = email.indexOf('@');
  if (atIndex <= 1) {
    return maskStringInternal(email, 1, 1);
  }
  const username = email.substring(0, atIndex);
  const domain = email.substring(atIndex);
  return `${maskStringInternal(username, 1, 0)}${domain}`;
}

/**
 * Masks a CPF or CNPJ number, showing the first 3 and last 2 digits.
 * @param doc The document number string to mask.
 * @returns A masked document number string.
 */
export const maskCpfCnpj = (doc: string): string => {
  const cleanedDoc = String(doc).replace(/\D/g, '');
  return maskStringInternal(cleanedDoc, 3, 2);
};

/**
 * A list of keys that are considered sensitive and should be masked.
 * The matching is case-insensitive and checks if the key *includes* the string.
 */
const SENSITIVE_KEYS = [
  'cpf', 'cnpj', 'documento', 'rg', 'ie', 'inscricao_estadual',
  'email', 'e_mail',
  'phone', 'telefone', 'celular',
  'name', 'nome', 'razao_social', 'nome_fantasia', 'contato',
  'address', 'endereco', 'bairro', 'cidade', 'cep',
  'password', 'senha', 'token', 'secret', 'key', 'authorization',
  'valor', 'preco', 'total', 'desconto', 'imposto',
  'conta', 'agencia', 'banco', 'dados_bancarios',
];

/**
 * Recursively masks sensitive data in an object, array, or any other data structure.
 * It creates a deep copy of the data with sensitive fields masked.
 * @param data The data to mask.
 * @returns A deep copy of the data with sensitive fields masked.
 */
export function maskData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => maskData(item));
  }

  if (typeof data === 'object') {
    const newObj: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const lowerCaseKey = key.toLowerCase();
        const value = data[key];

        const isSensitiveKey = SENSITIVE_KEYS.some(sensitiveKey => lowerCaseKey.includes(sensitiveKey));

        if (isSensitiveKey && typeof value === 'string') {
          if (lowerCaseKey.includes('email') || lowerCaseKey.includes('e_mail')) {
            newObj[key] = maskEmail(value);
          } else if (lowerCaseKey.includes('cpf') || lowerCaseKey.includes('cnpj') || lowerCaseKey.includes('documento')) {
            newObj[key] = maskCpfCnpj(value);
          } else if (lowerCaseKey.includes('phone') || lowerCaseKey.includes('telefone') || lowerCaseKey.includes('celular')) {
            newObj[key] = maskStringInternal(String(value).replace(/\D/g, ''), 2, 2);
          } else {
            newObj[key] = maskString(value);
          }
        } else {
          newObj[key] = maskData(value); // Recurse for nested objects/arrays
        }
      }
    }
    return newObj;
  }

  return data;
}
