import React from "react";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { router } from "expo-router";
import { Order } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";

type OrderCardProps = {
  order: Order;
};

const screenWidth = Dimensions.get("window").width;

const STATUS_COLORS = {
  pending: "#f1c40f",
  accepted: "#3498db",
  picked_up: "#9b59b6",
  on_the_way: "#2ecc71",
  delivered: "#2ecc71",
  cancelled: "#e74c3c",
};

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  picked_up: "Picked Up",
  on_the_way: "On The Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderCard({ order }: OrderCardProps) {
  const statusColor = STATUS_COLORS[order.status];
  const statusLabel = STATUS_LABELS[order.status];

  // Format date to be more readable
  const orderDate = new Date(order.createdAt);
  const formattedDate = `${orderDate.toLocaleDateString()} at ${orderDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/order/${order.id}`)}>
      <View style={styles.header}>
        <Text style={styles.restaurant}>{order.restaurantName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item.quantity}x {item.name} - ${item.price.toFixed(2)}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#ccc" />
          <Text style={styles.infoText}>{order.deliveryLocation}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#ccc" />
          <Text style={styles.infoText}>{formattedDate}</Text>
        </View>

        {order.estimatedDeliveryTime && (
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#ccc" />
            <Text style={styles.infoText}>ETA: {order.estimatedDeliveryTime}</Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#3b4957",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: screenWidth < 600 ? "100%" : "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  restaurant: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  itemsList: {
    marginBottom: 12,
  },
  item: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#4f5d75",
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#ccc",
    marginLeft: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
  },
});
