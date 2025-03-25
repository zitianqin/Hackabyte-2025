import { Request, Response, NextFunction } from "express";
import { validateSessionToken } from "../lucia-auth/session";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No session token found" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const result = await validateSessionToken(token);
    if (!result.user) {
      res.status(401).json({ error: "Invalid session token" });
      return;
    }

    (req as any).user = { id: result.user.id };
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
