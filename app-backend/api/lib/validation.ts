export const VALIDATION_LIMITS = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 64,
  EMAIL_MAX_LENGTH: 254,
} as const;

export function sanitizeString(str: string, maxLength: number): string {
  return str.slice(0, maxLength).trim();
}
