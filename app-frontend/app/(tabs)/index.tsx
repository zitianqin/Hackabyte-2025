import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { getAllRestaurants, Restaurant } from "@/services/api";
import RestaurantCard from "@/components/RestaurantCard";
import { router } from "expo-router";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const allRestaurants = await getAllRestaurants();
        setRestaurants(allRestaurants);

        // Select 3 random restaurants as featured
        const shuffled = [...allRestaurants].sort(() => 0.5 - Math.random());
        setFeaturedRestaurants(shuffled.slice(0, 3));

        setLoading(false);
      } catch (error) {
        console.error("Error loading restaurants:", error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e97e67" />
        <Text style={styles.loadingText}>Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/fatcow.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.welcomeText}>Fat Cow</Text>
        <Text style={styles.subtitle}>Delicious food delivered to your campus location</Text>
      </View>

      <Text style={styles.sectionTitle}>Featured Restaurants</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredContainer}>
        {featuredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} compact />
        ))}
      </ScrollView>

      <View style={styles.actionSection}>
        <Pressable style={[styles.actionButton, styles.orderNowButton]} onPress={() => router.push("/search")}>
          <Text style={styles.actionButtonText}>Find Food</Text>
        </Pressable>

        <Pressable style={[styles.actionButton, styles.trackOrderButton]} onPress={() => router.push("/orders")}>
          <Text style={styles.actionButtonText}>Track Orders</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>All Restaurants</Text>
      <View style={styles.restaurantsGrid}>
        {restaurants.slice(0, 6).map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </View>

      {restaurants.length > 6 && (
        <Pressable style={styles.viewAllButton} onPress={() => router.push("/search")}>
          <Text style={styles.viewAllText}>View All Restaurants</Text>
        </Pressable>
      )}
    </ScrollView>
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
    alignItems: "center",
    marginVertical: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 24,
    marginBottom: 16,
  },
  featuredContainer: {
    paddingRight: 16,
  },
  actionSection: {
    flexDirection: "row",
    marginTop: 24,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },
  orderNowButton: {
    backgroundColor: "#e97e67",
  },
  trackOrderButton: {
    backgroundColor: "#4f5d75",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  restaurantsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  viewAllButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e97e67",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  viewAllText: {
    color: "#e97e67",
    fontWeight: "bold",
    fontSize: 16,
  },
});
