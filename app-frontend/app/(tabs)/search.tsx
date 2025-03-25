import { Text, View, StyleSheet, Image, ScrollView, TextInput } from "react-native";
import { UNSWFoodList } from "../../components/UNSWFood";
import React from "react";

export default function SearchScreen() {
  const [search, setSearch] = React.useState("");
  const filteredOptions = UNSWFoodList.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.row}>
        <Text style={styles.heading}>Explore Food On Campus</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for cravings..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.cardsList}>
          {filteredOptions.map((c, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{c.name}</Text>
              <Text style={styles.cardDescription}>Location: {c.location}</Text>
              <Image source={c.image} style={styles.cardImage} resizeMode="cover" />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    color: "#fff",
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    minHeight: 100,
    minWidth: 150,
    flexGrow: 1,
    flexDirection: "column",
    borderRadius: 20,
    backgroundColor: "#4f5d75",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 25,
    margin: 15,
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
  },
  cardIcon: {
    fontSize: 36,
    color: "#fff",
  },
  cardDescription: {
    fontSize: 10,
    color: "#fff",
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
});
