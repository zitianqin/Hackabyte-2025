import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getRestaurantById, Restaurant, MenuItem } from "@/services/api";

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(
    new Map()
  );

  useEffect(() => {
    async function loadRestaurant() {
      if (!id) return;

      try {
        const fetchedRestaurant = await getRestaurantById(id);
        setRestaurant(fetchedRestaurant || null);
        setLoading(false);
      } catch (error) {
        console.error("Error loading restaurant:", error);
        setLoading(false);
      }
    }

    loadRestaurant();
  }, [id]);

  const handleAddItem = (menuItem: MenuItem) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const currentQuantity = newMap.get(menuItem.id) || 0;
      newMap.set(menuItem.id, currentQuantity + 1);
      return newMap;
    });
  };

  const handleRemoveItem = (menuItem: MenuItem) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const currentQuantity = newMap.get(menuItem.id) || 0;

      if (currentQuantity <= 1) {
        newMap.delete(menuItem.id);
      } else {
        newMap.set(menuItem.id, currentQuantity - 1);
      }

      return newMap;
    });
  };

  const totalItems = Array.from(selectedItems.values()).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  const totalPrice =
    restaurant?.menu?.reduce((sum, item) => {
      const quantity = selectedItems.get(item.id) || 0;
      return sum + item.price * quantity;
    }, 0) || 0;

  const handleCheckout = () => {
    if (!restaurant) return;

    const items =
      restaurant.menu
        ?.filter((item) => selectedItems.has(item.id))
        .map((item) => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: selectedItems.get(item.id) || 0,
        })) || [];

    router.push({
      pathname: "/checkout",
      params: {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: JSON.stringify(items),
        total: totalPrice.toString(),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e97e67" />
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#e97e67" />
        <Text style={styles.errorText}>Restaurant not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: restaurant.name,
          headerStyle: { backgroundColor: "#25292e" },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={restaurant.image} style={styles.headerImage} />

          <View style={styles.detailsContainer}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.location}>{restaurant.location}</Text>

            {restaurant.description && (
              <Text style={styles.description}>{restaurant.description}</Text>
            )}

            <Text style={styles.menuTitle}>Menu</Text>

            {restaurant.menu?.map((menuItem) => {
              const quantity = selectedItems.get(menuItem.id) || 0;

              return (
                <View key={menuItem.id} style={styles.menuItem}>
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{menuItem.name}</Text>
                    <Text style={styles.menuItemDesc}>
                      {menuItem.description}
                    </Text>
                    <Text style={styles.menuItemPrice}>
                      ${menuItem.price.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.quantityControls}>
                    {quantity > 0 ? (
                      <>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => handleRemoveItem(menuItem)}
                        >
                          <Ionicons name="remove" size={20} color="#fff" />
                        </Pressable>

                        <Text style={styles.quantityText}>{quantity}</Text>

                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => handleAddItem(menuItem)}
                        >
                          <Ionicons name="add" size={20} color="#fff" />
                        </Pressable>
                      </>
                    ) : (
                      <Pressable
                        style={styles.addButton}
                        onPress={() => handleAddItem(menuItem)}
                      >
                        <Text style={styles.addButtonText}>Add</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {totalItems > 0 && (
          <View style={styles.checkoutBar}>
            <View style={styles.checkoutInfo}>
              <Text style={styles.itemCount}>
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>

            <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </Pressable>
          </View>
        )}
      </View>
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
  backButton: {
    backgroundColor: "#e97e67",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 24,
    lineHeight: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3b4957",
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e97e67",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4f5d75",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 16,
  },
  addButton: {
    backgroundColor: "#e97e67",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  checkoutBar: {
    backgroundColor: "#3b4957",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkoutInfo: {
    flex: 1,
  },
  itemCount: {
    color: "#ccc",
    fontSize: 14,
  },
  totalPrice: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#e97e67",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
