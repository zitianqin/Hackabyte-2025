import * as argon2 from "argon2";
import { prisma } from "../index";
import { VALIDATION_LIMITS, sanitizeString } from "../lib/validation";
import {
  generateSessionToken,
  createSession,
  validateSessionToken,
  invalidateSession,
} from "../lucia-auth/session";

function validatePassword(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < VALIDATION_LIMITS.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      message: `Password must be at least ${VALIDATION_LIMITS.PASSWORD_MIN_LENGTH} characters long`,
    };
  }
  return { isValid: true, message: "" };
}

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  if (password.length > VALIDATION_LIMITS.PASSWORD_MAX_LENGTH) {
    throw new Error(
      `Password cannot exceed ${VALIDATION_LIMITS.PASSWORD_MAX_LENGTH} characters`
    );
  }

  const sanitizedEmail = sanitizeString(
    email,
    VALIDATION_LIMITS.EMAIL_MAX_LENGTH
  );
  const sanitizedName = sanitizeString(name, VALIDATION_LIMITS.NAME_MAX_LENGTH);

  const existingUser = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });
  if (existingUser) throw new Error("Email already in use");

  const { isValid, message } = validatePassword(password);
  if (!isValid) {
    throw new Error(message);
  }

  const hashedPassword = await argon2.hash(password);
  const user = await prisma.user.create({
    data: {
      email: sanitizedEmail,
      password: hashedPassword,
      name: sanitizedName,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await argon2.verify(user.password, password);
  if (!isValid) throw new Error("Invalid credentials");

  const token = generateSessionToken();
  await createSession(token, user.id);

  return {
    token: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function validateUserSession(token: string) {
  const result = await validateSessionToken(token);
  return result.user?.id || null;
}

export async function logoutUser(token: string) {
  const result = await validateSessionToken(token);
  if (result.session) {
    await invalidateSession(result.session.id);
  }
}

export async function getCurrentUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
  if (!user) throw new Error("User not found");
  return user;
}
