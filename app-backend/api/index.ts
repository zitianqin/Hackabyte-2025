import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { authenticate } from "./middleware/auth";
import * as authService from "./services/auth.service";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

export const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth Routes
app.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const user = await authService.registerUser(email, password, name);
    res.status(201).json({ user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
});

app.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
});

app.post("/auth/logout", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    await authService.logoutUser(token);
  }
  res.json({ message: "Logged out successfully" });
});

app.get("/auth/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await authService.getCurrentUser((req as any).user.id);
    res.json({ user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(401).json({ error: errorMessage });
  }
});

// Server setup
let server: ReturnType<typeof app.listen>;

export function startServer() {
  server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  return server;
}

export async function stopServer() {
  if (server) {
    await prisma.$disconnect();
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

process.on("SIGINT", async () => {
  try {
    await stopServer();
    console.log("Shutting down server gracefully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
