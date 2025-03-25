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

// Restaurant Routes
app.get("/api/restaurants", async (req: Request, res: Response) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: { menu: true },
    });
    res.json(restaurants);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
});

app.get("/api/restaurants/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: { menu: true },
    });
    if (!restaurant) {
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }
    res.json(restaurant);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
});

// Order Routes
app.post("/api/orders", authenticate, async (req: Request, res: Response) => {
  try {
    const { restaurantId, items, deliveryLocation } = req.body;
    const userId = (req as any).user.id;

    const order = await prisma.order.create({
      data: {
        restaurantId,
        userId,
        deliveryLocation,
        status: "pending",
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
});

app.get("/api/orders", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const { type } = req.query;

    let where = {};

    if (userRole === "customer") {
      where = { userId };
    } else if (userRole === "worker") {
      if (type === "available") {
        where = { status: "pending", deliveryPersonId: null };
      } else {
        where = { deliveryPersonId: userId };
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
});

app.get(
  "/api/orders/:id",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          restaurant: true,
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.json(order);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
);

app.put(
  "/api/orders/:orderId/status",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const userId = (req as any).user.id;

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          restaurant: true,
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      res.json(order);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
);

// Worker Routes
app.get(
  "/api/worker/deliveries",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const orders = await prisma.order.findMany({
        where: {
          deliveryPersonId: userId,
          status: {
            in: ["accepted", "picked_up", "on_the_way"],
          },
        },
        include: {
          restaurant: true,
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      res.json(orders);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
);

app.post(
  "/api/worker/deliveries/:orderId/accept",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const userId = (req as any).user.id;

      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          deliveryPersonId: userId,
          status: "accepted",
        },
        include: {
          restaurant: true,
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      res.json(order);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
);

app.get(
  "/api/worker/earnings",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const earnings = await prisma.earning.findMany({
        where: { deliveryPersonId: userId },
        include: { order: true },
      });

      res.json(earnings);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
);

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
