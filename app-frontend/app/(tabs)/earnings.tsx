import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getEarningsHistory, Earning } from "@/services/api";
import { useAppContext } from "@/services/AppContext";
import { router } from "expo-router";

export default function EarningsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const { appMode } = useAppContext();

  useEffect(() => {
    // If not in worker mode, redirect to home
    if (appMode !== "worker") {
      router.replace("/");
      return;
    }

    loadEarnings();
  }, [appMode]);

  async function loadEarnings() {
    try {
      setLoading(true);
      const earningsData = await getEarningsHistory();
      setEarnings(earningsData);
    } catch (error) {
      console.error("Error loading earnings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    loadEarnings();
  };

  // Calculate total earnings and pending earnings
  const totalEarnings = earnings.reduce(
    (sum, earning) => sum + earning.amount,
    0
  );
  const pendingEarnings = earnings
    .filter((e) => e.status === "pending")
    .reduce((sum, earning) => sum + earning.amount, 0);
  const completedEarnings = earnings
    .filter((e) => e.status === "completed")
    .reduce((sum, earning) => sum + earning.amount, 0);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e97e67" />
        <Text style={styles.loadingText}>Loading your earnings history...</Text>
      </View>
    );
  }

  // Group earnings by date
  const groupedEarnings: { [key: string]: Earning[] } = {};
  earnings.forEach((earning) => {
    const date = new Date(earning.date).toLocaleDateString();
    if (!groupedEarnings[date]) {
      groupedEarnings[date] = [];
    }
    groupedEarnings[date].push(earning);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Earnings</Text>
        <Pressable style={styles.refreshButton} onPress={handleRefresh}>
          {refreshing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.refreshText}>Refresh</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.earningsSummary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryAmount}>${totalEarnings.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.halfCard]}>
            <Text style={styles.summaryLabel}>Available</Text>
            <Text style={styles.summaryAmount}>
              ${completedEarnings.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.halfCard]}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryAmount}>
              ${pendingEarnings.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Earnings History</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          earnings.length === 0 ? styles.emptyContent : undefined
        }
      >
        {earnings.length > 0 ? (
          Object.entries(groupedEarnings).map(([date, dailyEarnings]) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateLabel}>{date}</Text>

              {dailyEarnings.map((earning) => (
                <View key={earning.id} style={styles.earningCard}>
                  <View style={styles.earningDetails}>
                    <Text style={styles.restaurantName}>
                      {earning.restaurantName}
                    </Text>
                    <Text style={styles.orderNumber}>
                      Order #{earning.orderId.split("-")[1]}
                    </Text>
                  </View>

                  <View style={styles.amountContainer}>
                    <Text style={styles.amount}>
                      ${earning.amount.toFixed(2)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        earning.status === "completed"
                          ? styles.completedBadge
                          : styles.pendingBadge,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {earning.status === "completed" ? "Paid" : "Pending"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="cash-outline" size={64} color="#4f5d75" />
            <Text style={styles.emptyText}>No earnings history yet</Text>
            <Text style={styles.emptySubText}>
              Start delivering to earn money
            </Text>
            <Pressable
              style={styles.browseButton}
              onPress={() => router.push("/worker")}
            >
              <Text style={styles.browseButtonText}>
                Browse Available Orders
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e97e67",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  refreshText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
  },
  earningsSummary: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#3b4957",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e97e67",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateSection: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ccc",
    marginBottom: 8,
  },
  earningCard: {
    backgroundColor: "#3b4957",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  earningDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 14,
    color: "#ccc",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: "#2ecc71",
  },
  pendingBadge: {
    backgroundColor: "#f1c40f",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#e97e67",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  browseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
