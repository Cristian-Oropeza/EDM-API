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