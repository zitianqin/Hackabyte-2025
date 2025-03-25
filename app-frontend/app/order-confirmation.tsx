import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getOrderById, Order } from "@/services/api";

export default function OrderConfirmationScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;

      try {
        const fetchedOrder = await getOrderById(orderId);
        setOrder(fetchedOrder || null);
        setLoading(false);
      } catch (error) {
        console.error("Error loading order details:", error);
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  const handleViewOrder = () => {
    router.push(`/order/${orderId}`);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e97e67" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#e97e67" />
        <Text style={styles.errorText}>Order not found</Text>
        <Pressable style={styles.actionButton} onPress={handleGoHome}>
          <Text style={styles.actionButtonText}>Return to Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Order Confirmed",
          headerStyle: { backgroundColor: "#25292e" },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.confirmationCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#2ecc71" />
          </View>

          <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
          <Text style={styles.confirmationText}>
            Your order has been placed successfully.
          </Text>

          <View style={styles.orderDetails}>
            <Text style={styles.orderNumberLabel}>Order Number</Text>
            <Text style={styles.orderNumber}>#{orderId}</Text>

            <Text style={styles.restaurantName}>{order.restaurantName}</Text>

            <View style={styles.detailsSection}>
              <Text style={styles.detailsLabel}>Estimated Delivery Time</Text>
              <Text style={styles.detailsValue}>
                {order.estimatedDeliveryTime || "25-30 minutes"}
              </Text>
            </View>

            <View style={styles.detailsSection}>
              <Text style={styles.detailsLabel}>Delivery Location</Text>
              <Text style={styles.detailsValue}>{order.deliveryLocation}</Text>
            </View>

            <View style={styles.detailsSection}>
              <Text style={styles.detailsLabel}>Total Amount</Text>
              <Text style={styles.detailsValue}>${order.total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable style={styles.viewOrderButton} onPress={handleViewOrder}>
              <Text style={styles.viewOrderButtonText}>View Order Details</Text>
            </Pressable>

            <Pressable style={styles.homeButton} onPress={handleGoHome}>
              <Text style={styles.homeButtonText}>Return to Home</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292f38",
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
  errorContainer: {
    flex: 1,
    backgroundColor: "#292f38",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  confirmationCard: {
    margin: 16,
    backgroundColor: "#3b4957",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 24,
  },
  orderDetails: {
    width: "100%",
    marginBottom: 24,
  },
  orderNumberLabel: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e97e67",
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 12,
  },
  detailsLabel: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 16,
    color: "#fff",
  },
  buttonsContainer: {
    width: "100%",
  },
  viewOrderButton: {
    backgroundColor: "#e97e67",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  viewOrderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: "#4f5d75",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#e97e67",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
