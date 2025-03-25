import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:3000";

// Types
export interface Restaurant {
  id: string;
  name: string;
  location: string;
  description?: string;
  image: any; // Keep local image support for now
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
  deliveryPersonId?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  role: "customer" | "worker";
  createdAt: string;
}

export interface Earning {
  id: string;
  orderId: string;
  restaurantName: string;
  amount: number;
  status: "pending" | "completed";
  date: string;
}

// API Helper functions
async function getAuthToken() {
  return await AsyncStorage.getItem("auth_token");
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth APIs
export async function register(email: string, password: string, name: string) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  await AsyncStorage.setItem("auth_token", response.token);
  return response.user;
}

export async function login(email: string, password: string) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  await AsyncStorage.setItem("auth_token", response.token);
  return response.user;
}

export async function getCurrentUser() {
  return apiRequest("/auth/me");
}

export async function logout() {
  await AsyncStorage.removeItem("auth_token");
}

// Restaurant APIs
export async function getAllRestaurants(): Promise<Restaurant[]> {
  try {
    return await apiRequest("/api/restaurants");
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    // Fallback to local data for development
    return UNSWFoodList.map((food) => ({
      id: food.name.toLowerCase().replace(/\s+/g, "-"),
      name: food.name,
      location: food.location,
      image: food.image,
    }));
  }
}

export async function getRestaurantById(
  id: string
): Promise<Restaurant | null> {
  try {
    return await apiRequest(`/api/restaurants/${id}`);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    // Fallback to local data for development
    const restaurant = UNSWFoodList.find(
      (food) => food.name.toLowerCase().replace(/\s+/g, "-") === id
    );
    if (!restaurant) return null;
    return {
      id,
      name: restaurant.name,
      location: restaurant.location,
      image: restaurant.image,
      menu: [
        {
          id: "1",
          name: "Sample Item 1",
          description: "A delicious sample item",
          price: 10.99,
        },
        {
          id: "2",
          name: "Sample Item 2",
          description: "Another tasty option",
          price: 12.99,
        },
      ],
    };
  }
}

// Order APIs
export async function getOrders(): Promise<Order[]> {
  return apiRequest("/api/orders");
}

export async function getOrderById(id: string): Promise<Order | null> {
  return apiRequest(`/api/orders/${id}`);
}

export async function placeOrder(order: {
  restaurantId: string;
  items: { menuItemId: string; quantity: number }[];
  deliveryLocation: string;
}): Promise<Order> {
  return apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
) {
  return apiRequest(`/api/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function submitFeedback(
  orderId: string,
  feedback: {
    rating: number;
    comment?: string;
  }
) {
  return apiRequest(`/api/orders/${orderId}/feedback`, {
    method: "POST",
    body: JSON.stringify(feedback),
  });
}

// Worker APIs
export async function getWorkerDeliveries(): Promise<Order[]> {
  return apiRequest("/api/worker/deliveries");
}

export async function acceptDelivery(orderId: string): Promise<Order> {
  return apiRequest(`/api/worker/deliveries/${orderId}/accept`, {
    method: "POST",
  });
}

export async function getEarningsHistory(): Promise<Earning[]> {
  return apiRequest("/api/worker/earnings");
}

// Local data for development fallback
import { UNSWFoodList } from "@/components/UNSWFood";
