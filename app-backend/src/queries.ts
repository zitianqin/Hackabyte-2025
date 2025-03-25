import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

// A `main` function so that we can use async/await
async function main() {
  // Create a restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Pizza Palace",
      description: "Best pizza in town!",
    },
  });
  console.log(`Created restaurant: ${restaurant.name}`);

  // Create a user
  const user = await prisma.user.create({
    data: {
      email: `user${Date.now()}@example.com`,
      name: "John Doe",
      password: "hashedPassword123", // In real app, this should be properly hashed
    },
  });
  console.log(`Created user: ${user.name}`);

  // Create an order
  const order = await prisma.order.create({
    data: {
      price: 25.99,
      userId: user.id,
      restaurantId: restaurant.id,
    },
    include: {
      user: true,
      restaurant: true,
    },
  });
  console.log(`Created order: ${JSON.stringify(order)}`);

  // Get all orders for a restaurant
  const restaurantOrders = await prisma.order.findMany({
    where: {
      restaurantId: restaurant.id,
    },
    include: {
      user: true,
    },
  });
  console.log(
    `All orders for ${restaurant.name}: ${JSON.stringify(restaurantOrders)}`
  );

  // Get all orders for a user
  const userOrders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      restaurant: true,
    },
  });
  console.log(`All orders for ${user.name}: ${JSON.stringify(userOrders)}`);

  // Update order status to delivered
  const updatedOrder = await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      delivered: true,
    },
  });
  console.log(
    `Updated order status to delivered: ${JSON.stringify(updatedOrder)}`
  );

  // Get all delivered orders
  const deliveredOrders = await prisma.order.findMany({
    where: {
      delivered: true,
    },
    include: {
      user: true,
      restaurant: true,
    },
  });
  console.log(`All delivered orders: ${JSON.stringify(deliveredOrders)}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
