import React from "react";
import { Stack, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/services/AppContext";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    }
  };

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <AppProvider>
      <Stack>
        {!isAuthenticated ? (
          // Auth screens
          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
              // Prevent going back to auth screen
              gestureEnabled: false,
            }}
          />
        ) : (
          // App screens
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="restaurant/[id]"
              options={{ headerShown: true }}
            />
            <Stack.Screen name="order/[id]" options={{ headerShown: true }} />
            <Stack.Screen name="checkout" options={{ headerShown: true }} />
            <Stack.Screen
              name="order-confirmation"
              options={{ headerShown: true }}
            />
          </>
        )}
      </Stack>
      <StatusBar style="light" />
    </AppProvider>
  );
}
