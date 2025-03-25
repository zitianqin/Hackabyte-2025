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
import {
  getWorkerDeliveries,
  Order,
  updateDeliveryStatus,
} from "@/services/api";
import { useAppContext } from "@/services/AppContext";
import { router } from "expo-router";

export default function ActiveDeliveriesScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeDeliveries, setActiveDeliveries] = useState<Order[]>([]);
  const { appMode } = useAppContext();

  useEffect(() => {
    // If not in worker mode, redirect to home
    if (appMode !== "worker") {
      router.replace("/");
      return;
    }

    loadDeliveries();
  }, [appMode]);

  async function loadDeliveries() {
    try {
      setLoading(true);
      const deliveries = await getWorkerDeliveries();
      setActiveDeliveries(deliveries);
    } catch (error) {
      console.error("Error loading active deliveries:", error);
      Alert.alert("Error", "Failed to load active deliveries");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    loadDeliveries();
  };

  const handleUpdateStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    const statusText =
      status === "picked_up"
        ? "Picked Up"
        : status === "on_the_way"
        ? "On The Way"
        : "Delivered";

    Alert.alert(
      `Mark as ${statusText}`,
      `Are you sure you want to mark this order as ${statusText.toLowerCase()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await updateDeliveryStatus(orderId, status);
              Alert.alert(
                "Success",
                `Order marked as ${statusText.toLowerCase()}`
              );
              loadDeliveries();
            } catch (error) {
              console.error("Error updating delivery status:", error);
              Alert.alert("Error", "Failed to update delivery status");
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
        <Text style={styles.loadingText}>Loading your deliveries...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Deliveries</Text>
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
          activeDeliveries.length === 0 ? styles.emptyContent : undefined
        }
      >
        {activeDeliveries.length > 0 ? (
          activeDeliveries.map((delivery) => (
            <View key={delivery.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.restaurantName}>
                  {delivery.restaurantName}
                </Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      getStatusStyle(delivery.status),
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusLabel(delivery.status)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    Pickup: {delivery.restaurantName}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="navigate-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    Deliver to: {delivery.deliveryLocation}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="basket-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    {delivery.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}{" "}
                    item(s):
                    {delivery.items.map(
                      (item) => ` ${item.quantity}x ${item.name}`
                    )}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    Earnings: ${(delivery.total * 0.3).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Show action buttons based on current status */}
              <View style={styles.actionButtons}>
                {delivery.status === "accepted" && (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleUpdateStatus(delivery.id, "picked_up")}
                  >
                    <Text style={styles.actionButtonText}>
                      Mark as Picked Up
                    </Text>
                  </Pressable>
                )}

                {delivery.status === "picked_up" && (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() =>
                      handleUpdateStatus(delivery.id, "on_the_way")
                    }
                  >
                    <Text style={styles.actionButtonText}>
                      Mark as On The Way
                    </Text>
                  </Pressable>
                )}

                {delivery.status === "on_the_way" && (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleUpdateStatus(delivery.id, "delivered")}
                  >
                    <Text style={styles.actionButtonText}>
                      Mark as Delivered
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="bicycle-outline" size={64} color="#4f5d75" />
            <Text style={styles.emptyText}>
              You don't have any active deliveries
            </Text>
            <Text style={styles.emptySubText}>
              Accept some orders to start delivering
            </Text>
            <Pressable
              style={styles.browseButton}
              onPress={() => router.push("/worker")}
            >
              <Text style={styles.browseButtonText}>
                Browse Available Orders
              </Text>
            </Pressable>
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
    case "delivered":
      return styles.deliveredBadge;
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
    case "delivered":
      return "Delivered";
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
    flex: 1,
  },
  statusContainer: {
    marginLeft: 8,
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
  deliveredBadge: {
    backgroundColor: "#2ecc71",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
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
  actionButtons: {
    flexDirection: "column",
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionButtonText: {
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
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#e97e67",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  browseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
