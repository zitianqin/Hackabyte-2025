import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Restaurant } from "@/services/api";

type RestaurantCardProps = {
  restaurant: Restaurant;
  compact?: boolean;
};

const screenWidth = Dimensions.get("window").width;

export default function RestaurantCard({
  restaurant,
  compact = false,
}: RestaurantCardProps) {
  return (
    <Pressable
      style={[styles.card, compact && styles.compactCard]}
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}
    >
      <Image
        source={restaurant.image}
        style={[styles.image, compact && styles.compactImage]}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {restaurant.location}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#3b4957",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 15,
    width: screenWidth < 600 ? "100%" : "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactCard: {
    width: 180,
    marginRight: 12,
    marginBottom: 0,
  },
  image: {
    width: "100%",
    height: 140,
  },
  compactImage: {
    height: 100,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: "#ccc",
  },
});
