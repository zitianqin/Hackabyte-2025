import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Platform } from "react-native";
import { AppMode } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

// Platform-specific storage implementation
const Storage = {
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  },

  getItem: async (key: string) => {
    try {
      if (Platform.OS === "web") {
        return await AsyncStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  },

  removeItem: async (key: string) => {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error("Error removing data:", error);
      throw error;
    }
  },
};

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  createdAt?: string;
}

interface AppContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const API_URL = "http://localhost:3000";

const defaultContext: AppContextType = {
  appMode: "customer",
  setAppMode: () => {},
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
};

export const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

async function makeApiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const token = await Storage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API request failed");
    }

    return response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appMode, setAppMode] = useState<AppMode>("customer");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await Storage.getItem("authToken");
      if (token) {
        const { user } = await makeApiRequest("/auth/me");
        setUser(user);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      await Storage.removeItem("authToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await makeApiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    await Storage.setItem("authToken", token);
    setUser(user);
    router.replace("/(tabs)");
  };

  const register = async (email: string, password: string, name: string) => {
    await makeApiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    await login(email, password);
  };

  const logout = async () => {
    try {
      const token = await Storage.getItem("authToken");
      if (token) {
        await makeApiRequest("/auth/logout", {
          method: "POST",
        });
      }
      await Storage.removeItem("authToken");
      setUser(null);
      router.replace("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear the token and user state even if the API call fails
      await Storage.removeItem("authToken");
      setUser(null);
      router.replace("/auth");
    }
  };

  return (
    <AppContext.Provider
      value={{
        appMode,
        setAppMode,
        user,
        setUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
