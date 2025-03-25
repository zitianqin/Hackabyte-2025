import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAvailableDeliveries, Order, acceptDelivery } from "@/services/api";
import { useAppContext } from "@/services/AppContext";
import { router } from "expo-router";

export default function WorkerScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const { appMode } = useAppContext();

  useEffect(() => {
    // If not in worker mode, redirect to home
    if (appMode !== "worker") {
      router.replace("/");
      return;
    }

    loadOrders();
  }, [appMode]);

  async function loadOrders() {
    try {
      setLoading(true);
      const orders = await getAvailableDeliveries();
      setAvailableOrders(orders);
    } catch (error) {
      console.error("Error loading available orders:", error);
      Alert.alert("Error", "Failed to load available orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleAcceptOrder = async (orderId: string) => {
    Alert.alert(
      "Accept Order",
      "Are you sure you want to accept this delivery?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => {
            try {
              await acceptDelivery(orderId);
              Alert.alert("Success", "You have accepted this delivery");
              loadOrders();
              router.push("/active-deliveries");
            } catch (error) {
              console.error("Error accepting order:", error);
              Alert.alert("Error", "Failed to accept delivery");
            }
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e97e67" />
        <Text style={styles.loadingText}>Loading available orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Available Orders</Text>
        <Pressable style={styles.refreshButton} onPress={handleRefresh}>
          {refreshing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.refreshText}>Refresh</Text>
            </>
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          availableOrders.length === 0 ? styles.emptyContent : undefined
        }
      >
        {availableOrders.length > 0 ? (
          availableOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.restaurantName}>
                  {order.restaurantName}
                </Text>
                <View style={styles.earningsContainer}>
                  <Text style={styles.earningsLabel}>Earnings</Text>
                  <Text style={styles.earnings}>
                    ${(order.total * 0.3).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    Pickup: {order.restaurantName}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="navigate-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    Deliver to: {order.deliveryLocation}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    Estimated delivery time: {order.estimatedDeliveryTime}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="basket-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}{" "}
                    item(s):
                    {order.items.map(
                      (item) => ` ${item.quantity}x ${item.name}`
                    )}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.acceptButton}
                onPress={() => handleAcceptOrder(order.id)}
              >
                <Text style={styles.acceptButtonText}>Accept Delivery</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="bicycle-outline" size={64} color="#4f5d75" />
            <Text style={styles.emptyText}>
              No available orders at this time
            </Text>
            <Text style={styles.emptySubText}>
              Check back soon or tap refresh to update
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e97e67",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  refreshText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCard: {
    backgroundColor: "#3b4957",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#4f5d75",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  earningsContainer: {
    alignItems: "flex-end",
  },
  earningsLabel: {
    fontSize: 12,
    color: "#ccc",
  },
  earnings: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
    flex: 1,
  },
  acceptButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
