import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppContext } from "@/services/AppContext";

export default function TabLayout() {
  const { appMode } = useAppContext();

  // Common screen options for both modes
  const screenOptions = {
    tabBarActiveTintColor: "#e97e67",
    headerStyle: {
      backgroundColor: "#25292e",
    },
    headerShadowVisible: false,
    headerTintColor: "#fff",
    tabBarStyle: {
      backgroundColor: "#25292e",
    },
    tabBarShowLabel: false, // Hide the tab labels
  };

  // Worker mode tabs
  if (appMode === "worker") {
    return (
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="worker"
          options={{
            title: "Available Orders",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "list" : "list-outline"}
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="active-deliveries"
          options={{
            title: "My Deliveries",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "bicycle" : "bicycle-outline"}
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="earnings"
          options={{
            title: "Earnings",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "cash" : "cash-outline"}
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={26}
              />
            ),
          }}
        />

        {/* Hide customer screens in worker mode */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="pickup" options={{ href: null }} />
        <Tabs.Screen name="search" options={{ href: null }} />
        <Tabs.Screen name="orders" options={{ href: null }} />
      </Tabs>
    );
  }

  // Default customer tabs
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pickup"
        options={{
          title: "Pickup",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bicycle" : "bicycle-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      {/* Hide worker screens in customer mode */}
      <Tabs.Screen name="worker" options={{ href: null }} />
      <Tabs.Screen name="active-deliveries" options={{ href: null }} />
      <Tabs.Screen name="earnings" options={{ href: null }} />
    </Tabs>
  );
}
