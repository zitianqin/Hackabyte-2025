import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { placeOrder, OrderItem } from "@/services/api";

export default function CheckoutScreen() {
  const params = useLocalSearchParams<{
    restaurantId: string;
    restaurantName: string;
    items: string;
    total: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [deliveryLocationError, setDeliveryLocationError] = useState("");

  // Parse the items from URL params
  const items: OrderItem[] = params.items ? JSON.parse(params.items) : [];
  const restaurantId = params.restaurantId || "";
  const restaurantName = params.restaurantName || "";
  const total = parseFloat(params.total || "0");

  const handlePlaceOrder = async () => {
    // Validate delivery location
    if (!deliveryLocation.trim()) {
      setDeliveryLocationError("Please enter a delivery location");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        restaurantId,
        restaurantName,
        items,
        total,
        deliveryLocation,
      };

      const order = await placeOrder(orderData);

      // Navigate to order confirmation
      router.replace({
        pathname: "/order-confirmation",
        params: { orderId: order.id },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert(
        "Order Failed",
        "There was a problem placing your order. Please try again.",
        [{ text: "OK" }]
      );
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Checkout",
          headerStyle: { backgroundColor: "#25292e" },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <Text style={styles.restaurantName}>{restaurantName}</Text>

            {items.map((item, index) => (
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
              <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>

            <Text style={styles.inputLabel}>Delivery Location</Text>
            <TextInput
              style={[
                styles.input,
                deliveryLocationError ? styles.inputError : null,
              ]}
              placeholder="e.g. Main Library, Level 3, Study Room 305"
              placeholderTextColor="#999"
              value={deliveryLocation}
              onChangeText={(text) => {
                setDeliveryLocation(text);
                if (text.trim()) setDeliveryLocationError("");
              }}
            />
            {deliveryLocationError ? (
              <Text style={styles.errorText}>{deliveryLocationError}</Text>
            ) : null}

            <Text style={styles.deliveryNote}>
              Please provide a specific location on campus where you can meet
              the delivery person.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimated Delivery Time</Text>
            <Text style={styles.estimatedTime}>25-30 minutes</Text>
          </View>
        </ScrollView>

        <View style={styles.orderButtonContainer}>
          <Pressable
            style={[styles.orderButton, loading && styles.orderButtonDisabled]}
            onPress={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.orderButtonText}>Place Order</Text>
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292f38",
  },
  section: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#3b4957",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 16,
    color: "#e97e67",
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemQuantity: {
    width: 36,
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
  inputLabel: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#4f5d75",
    padding: 12,
    borderRadius: 6,
    color: "#fff",
    marginBottom: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginBottom: 8,
  },
  deliveryNote: {
    fontSize: 12,
    color: "#ccc",
    fontStyle: "italic",
    marginTop: 8,
  },
  estimatedTime: {
    fontSize: 16,
    color: "#2ecc71",
    fontWeight: "bold",
  },
  orderButtonContainer: {
    padding: 16,
    backgroundColor: "#3b4957",
  },
  orderButton: {
    backgroundColor: "#e97e67",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonDisabled: {
    backgroundColor: "#7f8c8d",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
