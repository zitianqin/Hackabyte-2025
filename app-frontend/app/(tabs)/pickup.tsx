import React from "react";
import { Text, View, StyleSheet, ScrollView, TextInput, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function PickupScreen() {
  const [search, setSearch] = React.useState("");
  const delivery = [
    {
      store: "Boost Juice",
      order: "Banana Buzz",
      deliveryTime: "10 mins",
      date: "25/03/2025",
      location: "Ainsworth Cats Room 204",
    },
    {
      store: "Plume Cafe",
      order: "Coffe Frappe",
      deliveryTime: "7 mins",
      date: "21/03/2025",
      location: "Main Library Lvl 4",
    },
    {
      store: "Classic Kebab",
      order: "Kebab",
      deliveryTime: "6 mins",
      date: "14/03/2025",
      location: "Main Library Lvl 4",
    },
  ];
  const filteredOptions = delivery.filter(
    (d) =>
      d.store.toLowerCase().includes(search.toLowerCase()) ||
      d.order.toLowerCase().includes(search.toLowerCase()) ||
      d.date.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.heading}>Pick Up / Delivered Orders</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for pick ups or deliveries..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView contentContainerStyle={styles.cardsList} showsVerticalScrollIndicator={false}>
        {filteredOptions.map((d, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{d.store}</Text>
            <Text style={styles.cardDescription}>Order: {d.order}</Text>
            <Text style={styles.cardDescription}>Delivery Time: {d.deliveryTime}</Text>
            <Text style={styles.cardDescription}>Date: {d.date}</Text>
            <Text style={styles.cardDescription}>Location: {d.location}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292f38",
    padding: 20,
  },
  searchBar: {
    width: "75%",
    backgroundColor: "#3b4957",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
    alignSelf: "center",
  },
  row: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 30,
    flexDirection: "column",
    gap: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    width: "100%",
  },
  cardsList: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  card: {
    width: screenWidth < 600 ? "100%" : "55%",
    flexDirection: "column",
    borderRadius: 20,
    backgroundColor: "#4f5d75",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 10,
    padding: 25,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 13,
    color: "#fff",
  },
});
