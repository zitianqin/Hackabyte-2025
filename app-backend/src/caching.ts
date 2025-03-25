import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const startTime = performance.now();

  // Example of caching restaurant orders
  const cachedRestaurantOrders = await prisma.restaurant.findMany({
    where: {
      name: { contains: "Pizza" },
    },
    include: {
      orders: {
        include: {
          user: true,
        },
      },
    },
    cacheStrategy: {
      swr: 30, // 30 seconds
      ttl: 60, // 60 seconds
    },
  });

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  console.log(`The query took ${elapsedTime}ms.`);
  console.log(`It returned the following data: \n`, cachedRestaurantOrders);
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
