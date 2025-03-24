import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import React from "react";

export default function AccountScreen() {
  const options = [
    { name: "Personal Information", icon: "🛈" },
    { name: "Order History", icon: "🧾" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Profile</Text>
        <View style={styles.optionsList}>
          {options.map((o, index) => (
            <Pressable key={index} style={styles.optionsButton}>
              <Text style={styles.optionsIcon}>{o.icon}</Text>
              <Text style={styles.optionsType}>{o.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 100,
  },
  container: {
    alignItems: "center",
    gap: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    width: "100%",
  },
  optionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    borderRadius: 15,
    backgroundColor: "#3B4957",
  },
  optionsButton: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#4F5D75",
    borderRadius: 15,
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsIcon: {
    fontSize: 12,
    color: "#fff",
  },
  optionsType: {
    fontSize: 12,
    color: "#fff",
  },
});
