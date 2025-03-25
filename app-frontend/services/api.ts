const API_BASE_URL = "http://localhost:3000";

// App mode types and context
export type AppMode = "customer" | "worker";

// Mock data for available deliveries (for workers)
export const availableDeliveries: Order[] = [
  {
    id: "delivery-1",
    restaurantId: "rest-3",
    restaurantName: "Soul Origin",
    items: [
      {
        id: "item-10",
        menuItemId: "menu-3-0",
        name: "Chicken Sandwich",
        quantity: 1,
        price: 12,
      },
      {
        id: "item-11",
        menuItemId: "menu-3-1",
        name: "Water Bottle",
        quantity: 1,
        price: 3,
      },
    ],
    status: "pending",
    total: 15,
    deliveryLocation: "Engineering Building, Level 2",
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    estimatedDeliveryTime: "20-25 mins",
  },
  {
    id: "delivery-2",
    restaurantId: "rest-7",
    restaurantName: "Guzman y Gomez",
    items: [
      {
        id: "item-12",
        menuItemId: "menu-7-0",
        name: "Burrito Bowl",
        quantity: 1,
        price: 16,
      },
      {
        id: "item-13",
        menuItemId: "menu-7-1",
        name: "Nachos",
        quantity: 1,
        price: 10,
      },
    ],
    status: "pending",
    total: 26,
    deliveryLocation: "Law Building, Reception",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedDeliveryTime: "15-20 mins",
  },
];

// Mock active deliveries for workers
export const workerDeliveries: Order[] = [
  {
    id: "worker-delivery-1",
    restaurantId: "rest-12",
    restaurantName: "Subway",
    items: [
      {
        id: "item-20",
        menuItemId: "menu-12-0",
        name: "Footlong Italian BMT",
        quantity: 1,
        price: 14,
      },
      {
        id: "item-21",
        menuItemId: "menu-12-1",
        name: "Cookie",
        quantity: 2,
        price: 4,
      },
    ],
    status: "picked_up",
    total: 18,
    deliveryLocation: "Business School, Level 1",
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    estimatedDeliveryTime: "5-10 mins",
    deliveryPersonId: "worker-1",
  },
];

// Mock earnings history for workers
export interface Earning {
  id: string;
  orderId: string;
  restaurantName: string;
  amount: number;
  date: string;
  status: "completed" | "pending";
}

export const earningsHistory: Earning[] = [
  {
    id: "earning-1",
    orderId: "order-past-1",
    restaurantName: "Yallah",
    amount: 5.5,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    id: "earning-2",
    orderId: "order-past-2",
    restaurantName: "Subway",
    amount: 6.0,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    id: "earning-3",
    orderId: "worker-delivery-1",
    restaurantName: "Subway",
    amount: 6.5,
    date: new Date(Date.now() - 20 * 60000).toISOString(),
    status: "pending",
  },
];

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  image: any;
  description?: string;
  menu?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: any;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  status:
    | "pending"
    | "accepted"
    | "picked_up"
    | "on_the_way"
    | "delivered"
    | "cancelled";
  total: number;
  deliveryLocation: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  deliveryPersonId?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Feedback {
  orderId: string;
  rating: number;
  comment: string;
}

// Mock data for development
import { UNSWFoodList } from "../components/UNSWFood";

const restaurants: Restaurant[] = UNSWFoodList.map((food, index) => ({
  id: `rest-${index}`,
  name: food.name,
  location: food.location,
  image: food.image,
  description: `${food.name} is a popular eatery on campus offering delicious meals to students and staff.`,
  menu: Array(Math.floor(Math.random() * 5) + 3)
    .fill(0)
    .map((_, i) => ({
      id: `menu-${index}-${i}`,
      name: `Item ${i + 1}`,
      description: `Delicious menu item ${i + 1} from ${food.name}`,
      price: Math.floor(Math.random() * 15) + 8,
    })),
}));

const mockOrders: Order[] = [
  {
    id: "order-1",
    restaurantId: "rest-0",
    restaurantName: "Arthouse Kitchen Café",
    items: [
      {
        id: "item-1",
        menuItemId: "menu-0-0",
        name: "Avocado Toast",
        quantity: 1,
        price: 12,
      },
      {
        id: "item-2",
        menuItemId: "menu-0-1",
        name: "Flat White",
        quantity: 1,
        price: 5,
      },
    ],
    status: "on_the_way",
    total: 17,
    deliveryLocation: "Main Library, Level 3",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    estimatedDeliveryTime: "10 mins",
  },
  {
    id: "order-2",
    restaurantId: "rest-5",
    restaurantName: "Gradueat",
    items: [
      {
        id: "item-3",
        menuItemId: "menu-5-0",
        name: "Chicken Bowl",
        quantity: 1,
        price: 15,
      },
    ],
    status: "delivered",
    total: 15,
    deliveryLocation: "Computer Science Building, Room 201",
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
  {
    id: "order-3",
    restaurantId: "rest-10",
    restaurantName: "Mamak Village",
    items: [
      {
        id: "item-4",
        menuItemId: "menu-10-0",
        name: "Nasi Lemak",
        quantity: 1,
        price: 14,
      },
      {
        id: "item-5",
        menuItemId: "menu-10-1",
        name: "Teh Tarik",
        quantity: 2,
        price: 8,
      },
    ],
    status: "pending",
    total: 22,
    deliveryLocation: "Science Theatre",
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: "25 mins",
  },
];

// API service functions
export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  // In a real app, this would fetch from the API
  // const response = await fetch(`${API_BASE_URL}/api/restaurants`);
  // return response.json();
  return restaurants;
};

export const getRestaurantById = async (
  id: string
): Promise<Restaurant | undefined> => {
  // In a real app, this would fetch from the API
  // const response = await fetch(`${API_BASE_URL}/api/restaurants/${id}`);
  // return response.json();
  return restaurants.find((r) => r.id === id);
};

export const getOrders = async (): Promise<Order[]> => {
  // In a real app, this would fetch from the API
  // const response = await fetch(`${API_BASE_URL}/api/orders`);
  // return response.json();
  return mockOrders;
};

export const getOrderById = async (
  orderId: string
): Promise<Order | undefined> => {
  // In a real app, this would fetch from the API
  // const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
  // return response.json();
  return mockOrders.find((o) => o.id === orderId);
};

export const placeOrder = async (
  order: Omit<Order, "id" | "createdAt" | "status">
): Promise<Order> => {
  // In a real app, this would POST to the API
  // const response = await fetch(`${API_BASE_URL}/api/orders`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(order)
  // });
  // return response.json();

  const newOrder: Order = {
    ...order,
    id: `order-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: "25-30 mins",
  };

  mockOrders.push(newOrder);
  return newOrder;
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<Order> => {
  // In a real app, this would PUT to the API
  // const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ status })
  // });
  // return response.json();

  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = status;
  return order;
};

export const cancelOrder = async (orderId: string): Promise<Order> => {
  // In a real app, this would PUT to the API
  // const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
  //   method: 'PUT'
  // });
  // return response.json();

  return updateOrderStatus(orderId, "cancelled");
};

export const submitFeedback = async (
  orderId: string,
  feedback: Feedback
): Promise<void> => {
  // In a real app, this would POST to the API
  // await fetch(`${API_BASE_URL}/api/orders/${orderId}/feedback`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(feedback)
  // });

  console.log("Feedback submitted:", feedback);
};

// Worker-specific API functions
export const getAvailableDeliveries = async (): Promise<Order[]> => {
  // In a real app, this would fetch from the API
  // const response = await fetch(`${API_BASE_URL}/api/worker/deliveries/available`);
  // return response.json();

  return availableDeliveries;
};

export const getWorkerDeliveries = async (): Promise<Order[]> => {
  // In a real app, this would fetch from the API
  // const response = await fetch(`${API_BASE_URL}/api/worker/deliveries`);
  // return response.json();

  return workerDeliveries;
};

export const acceptDelivery = async (orderId: string): Promise<Order> => {
  // In a real app, this would POST to the API
  // const response = await fetch(`${API_BASE_URL}/api/worker/deliveries/${orderId}/accept`, {
  //   method: 'POST'
  // });
  // return response.json();

  const order = availableDeliveries.find((o) => o.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // Update order status and add to worker deliveries
  order.status = "accepted";
  order.deliveryPersonId = "worker-1"; // Mock worker ID
  workerDeliveries.push(order);

  // Remove from available deliveries
  const index = availableDeliveries.findIndex((o) => o.id === orderId);
  if (index !== -1) {
    availableDeliveries.splice(index, 1);
  }

  return order;
};

export const updateDeliveryStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<Order> => {
  // In a real app, this would PUT to the API
  // const response = await fetch(`${API_BASE_URL}/api/worker/deliveries/${orderId}/status`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ status })
  // });
  // return response.json();

  // Find the order in worker deliveries
  const order = workerDeliveries.find((o) => o.id === orderId);
  if (!order) {
    throw new Error("Delivery not found");
  }

  order.status = status;

  // If delivered, add to earnings
  if (status === "delivered") {
    const earning: Earning = {
      id: `earning-${Date.now()}`,
      orderId: order.id,
      restaurantName: order.restaurantName,
      amount: parseFloat((order.total * 0.3).toFixed(2)), // 30% of order total as earnings
      date: new Date().toISOString(),
      status: "pending",
    };

    earningsHistory.push(earning);
  }

  return order;
};

export const getEarningsHistory = async (): Promise<Earning[]> => {
  // In a real app, this would fetch from the API
  // const response = await fetch(`${API_BASE_URL}/api/worker/earnings`);
  // return response.json();

  return earningsHistory;
};
