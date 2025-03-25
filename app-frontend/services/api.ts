const API_BASE_URL = "http://localhost:3000";

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
