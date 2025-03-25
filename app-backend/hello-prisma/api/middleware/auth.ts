import { Request, Response, NextFunction } from "express";
import { validateSessionToken } from "../lucia-auth/session";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ error: "No session token found" });
      return;
    }

    const result = await validateSessionToken(token);
    if (!result.user) {
      res.clearCookie("token");
      res.status(401).json({ error: "Invalid session token" });
      return;
    }

    (req as any).user = { id: result.user.id };

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: result.session.expiresAt.getTime() - Date.now(),
    });

    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ error: "Authentication failed" });
  }
};
