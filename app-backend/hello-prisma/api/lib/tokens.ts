import { randomBytes } from "crypto";

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

export function validateToken(token: string): boolean {
  // Add any token validation logic here if needed
  return typeof token === "string" && token.length > 0;
}
