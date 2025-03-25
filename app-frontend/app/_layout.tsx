import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/services/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="restaurant/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="order/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="checkout" options={{ headerShown: true }} />
        <Stack.Screen
          name="order-confirmation"
          options={{ headerShown: true }}
        />
      </Stack>
      <StatusBar style="light" />
    </AppProvider>
  );
}
