export const VALIDATION_LIMITS = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  TASK_MAX_LENGTH: 512,
  MAX_TASKS: 256,
  UUID_LENGTH: 36,
  NAME_MAX_LENGTH: 64,
  EMAIL_MAX_LENGTH: 254,
  GOAL_MAX_LENGTH: 1024,
  DESCRIPTION_MAX_LENGTH: 2048,
} as const;

export function sanitizeString(str: string, maxLength: number): string {
  return str.slice(0, maxLength).trim();
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuid.length === VALIDATION_LIMITS.UUID_LENGTH && uuidRegex.test(uuid);
}
