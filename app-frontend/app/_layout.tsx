import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useAppContext } from "@/services/AppContext";
import { View, ActivityIndicator } from "react-native";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1a1a",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack>
      {!isAuthenticated ? (
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      ) : (
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
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
      <StatusBar style="light" />
    </AppProvider>
  );
}
