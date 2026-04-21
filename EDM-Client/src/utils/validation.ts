const DANGEROUS_CHARS = /[<>"'\\/;{}()]/;
const DANGEROUS_CHARS_PASSWORD = /[<>"';]/;

export const DANGEROUS_MSG =
  'No se permiten los caracteres: < > " \' / \\ ; { } ( )';
export const DANGEROUS_PASSWORD_MSG =
  'No se permiten los caracteres: < > " \' ;';

export function hasDangerousChars(value: string): boolean {
  return DANGEROUS_CHARS.test(value);
}

export function hasDangerousPasswordChars(value: string): boolean {
  return DANGEROUS_CHARS_PASSWORD.test(value);
}

export function validateNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Devuelve un array con TODOS los problemas de fortaleza de la contraseña.
 * Array vacío significa que la contraseña es fuerte.
 * Criterio OWASP: 8+ caracteres, mayúscula, minúscula, número y símbolo.
 */
export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe incluir al menos una letra mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe incluir al menos una letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe incluir al menos un número');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('La contraseña debe incluir al menos un símbolo (!@#$%...)');
  }

  return errors;
}

export function isStrongPassword(password: string): boolean {
  return getPasswordErrors(password).length === 0;
}

export function extractErrorMessages(err: any, fallback: string): string[] {
  const msg = err?.response?.data?.error;
  if (Array.isArray(msg)) return msg;
  if (typeof msg === 'string') return [msg];
  return [fallback];
}

export function getErrorStatus(err: any): number {
  return err?.response?.status ?? 0;
}

export function getErrorCode(err: any): string | undefined {
  return err?.response?.data?.errorCode;
}