import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { getOrders, Order } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function PickupScreen() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

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

  const activeOrders = orders.filter((o) =>
    ["pending", "accepted", "picked_up", "on_the_way"].includes(o.status)
  );

  const filteredOrders = activeOrders.filter(
    (o) =>
      o.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ) ||
      o.deliveryLocation.toLowerCase().includes(search.toLowerCase())
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
      <View style={styles.header}>
        <Text style={styles.heading}>Active Deliveries</Text>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#aaa"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search active deliveries..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredOrders.length > 0 ? (
          <View style={styles.cardsList}>
            {filteredOrders.map((order) => (
              <Pressable
                key={order.id}
                style={styles.card}
                onPress={() => router.push(`/order/${order.id}`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{order.restaurantName}</Text>
                  <View
                    style={[styles.statusBadge, getStatusStyle(order.status)]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusLabel(order.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="restaurant-outline"
                      size={16}
                      color="#ccc"
                    />
                    <Text style={styles.orderItems}>
                      {order.items
                        .map((item) => `${item.quantity}x ${item.name}`)
                        .join(", ")}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="#ccc" />
                    <Text style={styles.cardDescription}>
                      {order.deliveryLocation}
                    </Text>
                  </View>

                  {order.estimatedDeliveryTime && (
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color="#ccc" />
                      <Text style={styles.cardDescription}>
                        ETA: {order.estimatedDeliveryTime}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.viewDetails}>View Order Details →</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="bicycle" size={64} color="#4f5d75" />
            <Text style={styles.emptyText}>
              {search
                ? "No active deliveries found matching your search"
                : "You don't have any active deliveries"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function getStatusStyle(status: Order["status"]) {
  switch (status) {
    case "pending":
      return styles.pendingBadge;
    case "accepted":
      return styles.acceptedBadge;
    case "picked_up":
      return styles.pickedUpBadge;
    case "on_the_way":
      return styles.onTheWayBadge;
    default:
      return {};
  }
}

function getStatusLabel(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "picked_up":
      return "Picked Up";
    case "on_the_way":
      return "On The Way";
    default:
      return status;
  }
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
  header: {
    marginVertical: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b4957",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 48,
    color: "#fff",
    fontSize: 16,
  },
  cardsList: {
    marginTop: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#3b4957",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: "#f1c40f",
  },
  acceptedBadge: {
    backgroundColor: "#3498db",
  },
  pickedUpBadge: {
    backgroundColor: "#9b59b6",
  },
  onTheWayBadge: {
    backgroundColor: "#2ecc71",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  orderItems: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#ccc",
    marginLeft: 8,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#4f5d75",
    paddingTop: 12,
    alignItems: "flex-end",
  },
  viewDetails: {
    fontSize: 14,
    color: "#e97e67",
    fontWeight: "bold",
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
