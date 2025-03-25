// import { Request, Response, NextFunction } from "express";
// import { redisClient, SESSION_TTL } from "../services/auth.service";

// export const refreshSession = async (req: Request, res: Response, next: NextFunction) => {
//   const sessionId = req.cookies.sessionId;
//   if (sessionId) {
//     // Refresh Redis TTL
//     await redisClient.expire(`session:${sessionId}`, SESSION_TTL);

//     // Refresh cookie
//     res.cookie("sessionId", sessionId, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: SESSION_TTL * 1000,
//     });
//   }
//   next();
// };
