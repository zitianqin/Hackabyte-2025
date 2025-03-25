import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from "react-native";
import { getOrders, Order } from "@/services/api";
import OrderCard from "@/components/OrderCard";
import { Ionicons } from "@expo/vector-icons";

export default function OrdersScreen() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error loading orders:", error);
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.restaurantName.toLowerCase().includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query)) ||
      order.deliveryLocation.toLowerCase().includes(query)
    );
  });

  // Group orders by status
  const activeOrders = filteredOrders.filter((o) =>
    ["pending", "accepted", "picked_up", "on_the_way"].includes(o.status)
  );

  const pastOrders = filteredOrders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status)
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e97e67" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="#ccc"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for orders..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeOrders.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            <View style={styles.ordersContainer}>
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </View>
          </>
        )}

        {pastOrders.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Past Orders</Text>
            <View style={styles.ordersContainer}>
              {pastOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </View>
          </>
        )}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#4f5d75" />
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No orders found matching your search"
                : "You don't have any orders yet"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292f38",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#292f38",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b4957",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  ordersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
});
