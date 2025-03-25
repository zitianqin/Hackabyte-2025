import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import React from "react";

export default function AccountScreen() {
  const [personalDetails, setPersonalDetails] = React.useState(false);
  const [orderHistory, setOrderHistory] = React.useState(false);
  const [settings, setSettings] = React.useState(false);

  const options = [
    { name: "Personal Information", icon: "ℹ" },
    { name: "Order History", icon: "🧾" },
    { name: "Notifications", icon: "✉️" },
    { name: "Settings", icon: "⚙️" },
  ];

  const handleButtonClick = (name: string) => {
    setPersonalDetails(false);
    setOrderHistory(false);
    setSettings(false);

    name === "Personal Information" && setPersonalDetails(true);
    name === "Order History" && setOrderHistory(true);
    name === "Settings" && setSettings(true);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.heading}>Profile</Text>
      <View style={styles.optionsList}>
        {options.map((o, index) => (
          <Pressable key={index} style={styles.optionsButton} onPress={() => handleButtonClick(o.name)}>
            <Text style={styles.optionsIcon}>{o.icon}</Text>
            <Text style={styles.optionsType}>{o.name}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {personalDetails && (
          <View style={styles.cardList}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Name</Text>
              <Text style={styles.cardDescription}>some rando name</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Email</Text>
              <Text style={styles.cardDescription}>somerandoname@example.com</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Phone</Text>
              <Text style={styles.cardDescription}>1234-567-890</Text>
            </View>
          </View>
        )}

        {orderHistory && (
          <View style={styles.cardList}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Store: Yallah</Text>
              <Text style={styles.cardDescription}>Order: HSP .....</Text>
              <Text style={styles.cardDescription}>Date: 25/03/2025</Text>
              <Text style={styles.cardDescription}>Price: $190.78</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Store: Tropical Green</Text>
              <Text style={styles.cardDescription}>Order: Pho .....</Text>
              <Text style={styles.cardDescription}>Date: 25/03/2025</Text>
              <Text style={styles.cardDescription}>Price: $12</Text>
            </View>
          </View>
        )}

        {settings && (
          <View style={styles.cardList}>
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Payment</Text>
              <Text style={styles.cardAction}>Add payment method</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Favourites</Text>
              <Text style={styles.cardAction}>See favourited stores</Text>
            </View>

            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Privacy</Text>
              <Text style={styles.cardAction}>Learn about privacy</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Notifications</Text>
              <Text style={styles.cardAction}>Manage delivery and promotional notifications</Text>
            </View>

            <Text style={styles.sectionTitle}>More</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Become a Partner Restaurant</Text>
              <Text style={styles.cardAction}>Join</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Become a COW</Text>
              <Text style={styles.cardAction}>Join</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#292f38",
    paddingVertical: 50,
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
    marginBottom: 10,
  },
  optionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    borderRadius: 15,
    backgroundColor: "#3B4957",
    alignSelf: "center",
    marginBottom: 20,
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
  cardList: {
    flexDirection: "column",
    gap: 10,
    width: "100%",
    paddingBottom: 30,
  },
  card: {
    padding: 20,
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#25292e",
  },
  cardDescription: {
    fontSize: 12,
    color: "#25292e",
  },
  cardAction: {
    fontSize: 12,
    backgroundColor: "#4F5D75",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
});
