import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import { prisma } from "../index";
import { VALIDATION_LIMITS, sanitizeString } from "../lib/validation";
import {
  generateSessionToken,
  createSession,
  validateSessionToken,
  invalidateSession,
} from "../lucia-auth/session";
import { sendEmail } from "../lib/email";
import { generateToken } from "../lib/tokens";

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

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const isValid = await argon2.verify(user.password, currentPassword);
  if (!isValid) throw new Error("Current password is incorrect");

  const { isValid: newPasswordValid, message } = validatePassword(newPassword);
  if (!newPasswordValid) {
    throw new Error(message);
  }

  const hashedNewPassword = await argon2.hash(newPassword);

  // Delete all sessions for this user
  await prisma.session.deleteMany({
    where: { userId: userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
}

// Add these new functions
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw new Error(
      "If an account exists with this email, a reset link will be sent"
    );

  const resetToken = generateToken();
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: "Reset Your FlowmoTime Password",
    html: `
      <p>Hello,</p>
      <p>Someone requested a password reset for your FlowmoTime account.</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });

  return {
    message: "If an account exists with this email, a reset link will be sent",
  };
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) throw new Error("Invalid or expired reset token");

  const { isValid, message } = validatePassword(newPassword);
  if (!isValid) throw new Error(message);

  const hashedPassword = await argon2.hash(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: "Password reset successfully" };
}
