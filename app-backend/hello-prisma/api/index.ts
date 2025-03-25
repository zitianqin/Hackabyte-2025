import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { authenticate } from "./middleware/auth";
import * as authService from "./services/auth.service";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
// import { refreshSession } from "./middleware/refreshSession";
// import bodyParser from "body-parser";

dotenv.config();
const app = express();
const port = process.env.PORT;

// Export the prisma instance so it can be used in tests
export const prisma = new PrismaClient();

// // Determine the environment
// const isProduction = true; // process.env.NODE_ENV === "production";

// Middleware
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
// app.use(isProduction ? express.urlencoded({ extended: true }) : express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Routes
app.post(
  "/auth/register",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  }
);

app.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.json({ user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
});

app.post("/auth/logout", async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (token) {
    await authService.logoutUser(token);
  }
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

app.put(
  "/auth/change-password",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(
        (req as any).user.id,
        currentPassword,
        newPassword
      );
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({ error: errorMessage });
    }
  }
);

app.post("/auth/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
});

app.post("/auth/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
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

// Task Routes
// app.get("/tasks", authenticate, async (req: Request, res: Response) => {
//   try {
//     const tasks = await taskService.getTasks((req as any).user.id);
//     res.json({ tasks });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.put("/tasks", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { tasks } = req.body;
//     await taskService.setTasks((req as any).user.id, tasks);
//     res.json({ message: "Tasks updated successfully" });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.post("/tasks", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { id, title } = req.body;
//     const task = await taskService.createTask(id, title, (req as any).user.id);
//     res.status(201).json({ task });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.put("/tasks/reorder", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { taskOrders } = req.body;
//     await taskService.updateTaskOrders((req as any).user.id, taskOrders);
//     res.json({ message: "Task order updated successfully" });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.delete("/tasks/completed", authenticate, async (req: Request, res: Response) => {
//   try {
//     await taskService.deleteCompletedTasks((req as any).user.id);
//     res.json({ message: "Completed tasks deleted successfully" });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.put("/tasks/:id", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { title, completed } = req.body;
//     const task = await taskService.updateTask(id, (req as any).user.id, { title, completed });
//     res.json({ task });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(404).json({ error: errorMessage });
//   }
// });

// app.delete("/tasks/:id", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     await taskService.deleteTask(id, (req as any).user.id);
//     res.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(404).json({ error: errorMessage });
//   }
// });

// Goal Routes
// app.get("/goals", authenticate, async (req: Request, res: Response) => {
//   try {
//     const goals = await goalService.getGoals((req as any).user.id);
//     res.json({ goals });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.post("/goals", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { description } = req.body;
//     const goal = await goalService.createGoal(
//       description,
//       (req as any).user.id
//     );
//     res.status(201).json({ goal });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.put("/goals/:id", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { description } = req.body;
//     const goal = await goalService.updateGoal(
//       id,
//       (req as any).user.id,
//       description
//     );
//     res.json({ goal });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(404).json({ error: errorMessage });
//   }
// });

// app.delete("/goals/:id", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     await goalService.deleteGoal(id, (req as any).user.id);
//     res.json({ message: "Goal deleted successfully" });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(404).json({ error: errorMessage });
//   }
// });

// Timer Routes
// app.post("/timer/start", authenticate, async (req: Request, res: Response) => {
//   try {
//     const session = await timerService.startSession((req as any).user.id);
//     res.json({ session });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(400).json({ error: errorMessage });
//   }
// });

// app.post("/timer/stop", authenticate, async (req: Request, res: Response) => {
//   try {
//     const session = await timerService.stopSession((req as any).user.id);
//     res.json({ session });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(400).json({ error: errorMessage });
//   }
// });

// app.get("/timer/status", authenticate, async (req: Request, res: Response) => {
//   try {
//     const status = await timerService.getTimerStatus((req as any).user.id);
//     res.json(status);
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// Stats Routes
// app.get("/stats", authenticate, async (req: Request, res: Response) => {
//   try {
//     const stats = await statsService.getUserStats((req as any).user.id);
//     res.json({ stats });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// // Focus Groups Routes
// app.get("/focus-groups", authenticate, async (req: Request, res: Response) => {
//   try {
//     const focusGroups = await focusGroupService.getFocusGroups();
//     res.json({ focusGroups });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.post("/focus-groups", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { name, description } = req.body;
//     const focusGroup = await focusGroupService.createFocusGroup(
//       name,
//       description,
//       (req as any).user.id
//     );
//     res.status(201).json({ focusGroup });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.get(
//   "/focus-groups/:id",
//   authenticate,
//   async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const focusGroup = await focusGroupService.getFocusGroup(id);
//       res.json({ focusGroup });
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "An unknown error occurred";
//       res.status(404).json({ error: errorMessage });
//     }
//   }
// );

// app.post(
//   "/focus-groups/:id/join",
//   authenticate,
//   async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       await focusGroupService.joinFocusGroup(id, (req as any).user.id);
//       res.json({ message: "Joined focus group successfully" });
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "An unknown error occurred";
//       res.status(400).json({ error: errorMessage });
//     }
//   }
// );

// app.post(
//   "/focus-groups/:id/leave",
//   authenticate,
//   async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       await focusGroupService.leaveFocusGroup(id, (req as any).user.id);
//       res.json({ message: "Left focus group successfully" });
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "An unknown error occurred";
//       res.status(400).json({ error: errorMessage });
//     }
//   }
// );

// // Settings Routes
// app.get("/settings", authenticate, async (req: Request, res: Response) => {
//   try {
//     const settings = await settingsService.getSettings((req as any).user.id);
//     res.json({ settings });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.put("/settings", authenticate, async (req: Request, res: Response) => {
//   try {
//     const { theme, notifications } = req.body;
//     const settings = await settingsService.updateSettings(
//       (req as any).user.id,
//       { theme, notifications }
//     );
//     res.json({ settings });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// // Root endpoint
// app.get("/", (req: Request, res: Response) => {
//   res.json({ message: "Welcome to the Express + TypeScript Server!" });
// });

// // Handle 404 Errors
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ error: "Not found" });
// });

// // Running the servers
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

// Handle graceful shutdown
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
