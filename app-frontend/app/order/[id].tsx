import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getOrderById,
  Order,
  updateOrderStatus,
  cancelOrder,
  submitFeedback,
} from "@/services/api";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    if (!id) return;

    try {
      const fetchedOrder = await getOrderById(id);
      setOrder(fetchedOrder || null);
      setLoading(false);
    } catch (error) {
      console.error("Error loading order details:", error);
      setLoading(false);
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return;

    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await cancelOrder(order.id);
            loadOrder();
          } catch (error) {
            console.error("Error cancelling order:", error);
            Alert.alert(
              "Error",
              "Failed to cancel the order. Please try again."
            );
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleConfirmDelivery = async () => {
    if (!order) return;

    Alert.alert("Confirm Delivery", "Did you receive your order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Received",
        onPress: async () => {
          try {
            setLoading(true);
            await updateOrderStatus(order.id, "delivered");
            loadOrder();
            setShowFeedbackForm(true);
          } catch (error) {
            console.error("Error confirming delivery:", error);
            Alert.alert(
              "Error",
              "Failed to confirm the delivery. Please try again."
            );
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleSubmitFeedback = async () => {
    if (!order) return;

    setSubmittingFeedback(true);

    try {
      await submitFeedback(order.id, {
        orderId: order.id,
        rating: feedbackRating,
        comment: feedbackComment,
      });

      Alert.alert(
        "Thank You!",
        "Your feedback has been submitted successfully.",
        [{ text: "OK", onPress: () => setShowFeedbackForm(false) }]
      );
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingFeedback(false);
    }
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
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/orders")}
        >
          <Text style={styles.actionButtonText}>Go to Orders</Text>
        </Pressable>
      </View>
    );
  }

  const isOrderActive = [
    "pending",
    "accepted",
    "picked_up",
    "on_the_way",
  ].includes(order.status);
  const canCancel = ["pending", "accepted"].includes(order.status);
  const canConfirmDelivery = order.status === "on_the_way";
  const isDelivered = order.status === "delivered";

  // Format date to be more readable
  const orderDate = new Date(order.createdAt);
  const formattedDate = `${orderDate.toLocaleDateString()} at ${orderDate.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}`;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Order Details",
          headerStyle: { backgroundColor: "#25292e" },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.orderNumber}>Order #{order.id}</Text>
            <View
              style={[styles.statusBadge, getStatusBadgeStyle(order.status)]}
            >
              <Text style={styles.statusText}>
                {getStatusLabel(order.status)}
              </Text>
            </View>
          </View>

          {!showFeedbackForm ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Restaurant</Text>
                <Text style={styles.restaurantName}>
                  {order.restaurantName}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalPrice}>
                    ${order.total.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delivery Details</Text>

                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    {order.deliveryLocation}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={18} color="#ccc" />
                  <Text style={styles.detailText}>
                    Ordered on {formattedDate}
                  </Text>
                </View>

                {order.estimatedDeliveryTime && (
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={18} color="#ccc" />
                    <Text style={styles.detailText}>
                      Estimated delivery: {order.estimatedDeliveryTime}
                    </Text>
                  </View>
                )}
              </View>

              {isOrderActive && (
                <View style={styles.trackingSection}>
                  <Text style={styles.sectionTitle}>Order Tracking</Text>
                  <View style={styles.trackingSteps}>
                    <TrackingStep
                      label="Order Placed"
                      completed={true}
                      active={order.status === "pending"}
                    />
                    <TrackingStep
                      label="Order Accepted"
                      completed={[
                        "accepted",
                        "picked_up",
                        "on_the_way",
                      ].includes(order.status)}
                      active={order.status === "accepted"}
                    />
                    <TrackingStep
                      label="Food Picked Up"
                      completed={["picked_up", "on_the_way"].includes(
                        order.status
                      )}
                      active={order.status === "picked_up"}
                    />
                    <TrackingStep
                      label="On The Way"
                      completed={order.status === "on_the_way"}
                      active={order.status === "on_the_way"}
                    />
                    <TrackingStep
                      label="Delivered"
                      completed={order.status === "delivered"}
                      active={false}
                    />
                  </View>
                </View>
              )}

              <View style={styles.actionsContainer}>
                {canCancel && (
                  <Pressable
                    style={styles.cancelButton}
                    onPress={handleCancelOrder}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Order</Text>
                  </Pressable>
                )}

                {canConfirmDelivery && (
                  <Pressable
                    style={styles.confirmButton}
                    onPress={handleConfirmDelivery}
                  >
                    <Text style={styles.confirmButtonText}>
                      Confirm Delivery
                    </Text>
                  </Pressable>
                )}

                {isDelivered && !showFeedbackForm && (
                  <Pressable
                    style={styles.feedbackButton}
                    onPress={() => setShowFeedbackForm(true)}
                  >
                    <Text style={styles.feedbackButtonText}>
                      Leave Feedback
                    </Text>
                  </Pressable>
                )}
              </View>
            </>
          ) : (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>Rate Your Experience</Text>
              <Text style={styles.feedbackSubtitle}>
                How was your order from {order.restaurantName}?
              </Text>

              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Pressable
                    key={rating}
                    style={styles.ratingButton}
                    onPress={() => setFeedbackRating(rating)}
                  >
                    <Ionicons
                      name={rating <= feedbackRating ? "star" : "star-outline"}
                      size={36}
                      color={rating <= feedbackRating ? "#f1c40f" : "#ccc"}
                    />
                  </Pressable>
                ))}
              </View>

              <Text style={styles.commentLabel}>Comments (optional)</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Tell us more about your experience..."
                placeholderTextColor="#999"
                value={feedbackComment}
                onChangeText={setFeedbackComment}
                multiline
                numberOfLines={4}
              />

              <View style={styles.feedbackButtonsRow}>
                <Pressable
                  style={styles.cancelFeedbackButton}
                  onPress={() => setShowFeedbackForm(false)}
                >
                  <Text style={styles.cancelFeedbackText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.submitFeedbackButton}
                  onPress={handleSubmitFeedback}
                  disabled={submittingFeedback}
                >
                  {submittingFeedback ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitFeedbackText}>
                      Submit Feedback
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

function TrackingStep({
  label,
  completed,
  active,
}: {
  label: string;
  completed: boolean;
  active: boolean;
}) {
  return (
    <View style={styles.trackingStep}>
      <View
        style={[
          styles.trackingDot,
          completed && styles.completedDot,
          active && styles.activeDot,
        ]}
      >
        {completed && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text
        style={[
          styles.trackingLabel,
          completed && styles.completedLabel,
          active && styles.activeLabel,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function getStatusBadgeStyle(status: Order["status"]) {
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
    case "cancelled":
      return styles.cancelledBadge;
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
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
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
  card: {
    margin: 16,
    backgroundColor: "#3b4957",
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
  cancelledBadge: {
    backgroundColor: "#e74c3c",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ccc",
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 18,
    color: "#fff",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemQuantity: {
    width: 30,
    fontSize: 14,
    fontWeight: "bold",
    color: "#ccc",
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#4f5d75",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e97e67",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
  trackingSection: {
    marginBottom: 24,
  },
  trackingSteps: {
    marginTop: 8,
  },
  trackingStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  trackingDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4f5d75",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  completedDot: {
    backgroundColor: "#2ecc71",
  },
  activeDot: {
    backgroundColor: "#e97e67",
  },
  trackingLabel: {
    fontSize: 14,
    color: "#ccc",
  },
  completedLabel: {
    color: "#2ecc71",
  },
  activeLabel: {
    color: "#e97e67",
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "column",
    gap: 12,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackButton: {
    backgroundColor: "#f1c40f",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  feedbackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackContainer: {
    alignItems: "center",
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 24,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  ratingButton: {
    marginHorizontal: 6,
  },
  commentLabel: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "bold",
    color: "#ccc",
    marginBottom: 8,
  },
  commentInput: {
    width: "100%",
    backgroundColor: "#4f5d75",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    height: 100,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  feedbackButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  cancelFeedbackButton: {
    flex: 1,
    backgroundColor: "#4f5d75",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelFeedbackText: {
    color: "#fff",
    fontSize: 16,
  },
  submitFeedbackButton: {
    flex: 1,
    backgroundColor: "#e97e67",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitFeedbackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
