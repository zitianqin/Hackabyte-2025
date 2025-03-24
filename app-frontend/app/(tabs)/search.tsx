import { Text, View, StyleSheet, ScrollView } from "react-native";
import { UNSWFoodList, Categories } from "../../components/UNSWFood";

export default function SearchScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.heading}>Browse Categories</Text>
        <View style={styles.cardsList}>
          {Categories.map((c, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardIcon}>{c.icon}</Text>
              <Text style={styles.cardTitle}>{c.name}</Text>
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
  row: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 30,
    flexDirection: "column",
    gap: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  cardsList: {
    flexDirection: "row",
    gap: 15,
  },
  card: {
    minHeight: 100,
    minWidth: 150,
    flexDirection: "column",
    borderRadius: 20,
    backgroundColor: "#4F5D75",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
  },
  cardIcon: {
    fontSize: 36,
    color: "#fff",
  },
});
