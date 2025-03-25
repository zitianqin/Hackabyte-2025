import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "@/services/AppContext";
import { router } from "expo-router";

export default function AccountScreen() {
  const [activeSection, setActiveSection] = useState("personal");
  const { appMode, setAppMode, user, logout } = useAppContext();

  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
  });

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "March 2025";

  const handleSectionPress = (section: string) => {
    setActiveSection(section);
  };

  const handleToggleAppMode = () => {
    setAppMode(appMode === "customer" ? "worker" : "customer");
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const openEditProfileModal = () => {
    setEditProfileModal(!editProfileModal);
  };

  const handleSaveChanges = () => {
    setEditProfileModal(false);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <LinearGradient colors={["#3b4957", "#25292e"]} style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileInitials}>
            {user?.name.charAt(0) || "?"}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || "Loading..."}</Text>
        <Text style={styles.userEmail}>{user?.email || "Loading..."}</Text>
        <Text style={styles.memberSince}>Member since {memberSince}</Text>
        <View style={styles.modeIndicator}>
          <Text style={styles.modeLabel}>
            {appMode === "customer" ? "Customer Mode" : "Worker Mode"}
          </Text>
        </View>
      </LinearGradient>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeSection === "personal" && styles.activeTab]}
          onPress={() => handleSectionPress("personal")}
        >
          <Ionicons
            name="person"
            size={20}
            color={activeSection === "personal" ? "#e97e67" : "#ccc"}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === "personal" && styles.activeTabText,
            ]}
          >
            Profile
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeSection === "orders" && styles.activeTab]}
          onPress={() => handleSectionPress("orders")}
        >
          <Ionicons
            name="receipt"
            size={20}
            color={activeSection === "orders" ? "#e97e67" : "#ccc"}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === "orders" && styles.activeTabText,
            ]}
          >
            Orders
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeSection === "settings" && styles.activeTab]}
          onPress={() => handleSectionPress("settings")}
        >
          <Ionicons
            name="settings"
            size={20}
            color={activeSection === "settings" ? "#e97e67" : "#ccc"}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === "settings" && styles.activeTabText,
            ]}
          >
            Settings
          </Text>
        </Pressable>
      </View>

      {/* Content Section */}
      <ScrollView style={styles.contentContainer}>
        {activeSection === "personal" && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#e97e67"
                  style={styles.infoIcon}
                />
                <View>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoValue}>
                    {user?.phone || "Loading..."}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#e97e67"
                  style={styles.infoIcon}
                />
                <View>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoValue}>
                    {user?.email || "Loading..."}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#e97e67"
                  style={styles.infoIcon}
                />
                <View>
                  <Text style={styles.infoLabel}>Default Location</Text>
                  <Text style={styles.infoValue}>
                    {user?.location || "Loading..."}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable style={styles.editButton} onPress={openEditProfileModal}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </View>
        )}

        {activeSection === "orders" && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Order History</Text>
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color="#4f5d75" />
              <Text style={styles.emptyText}>No order history yet</Text>
              <Pressable
                style={styles.browseButton}
                onPress={() => router.push("/")}
              >
                <Text style={styles.browseButtonText}>Browse Restaurants</Text>
              </Pressable>
            </View>
          </View>
        )}

        {activeSection === "settings" && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.settingsCard}>
              {/* Mode toggle switch */}
              <View style={styles.settingRow}>
                <Ionicons
                  name={
                    appMode === "customer"
                      ? "fast-food-outline"
                      : "bicycle-outline"
                  }
                  size={22}
                  color="#e97e67"
                  style={styles.settingIcon}
                />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>
                    {appMode === "customer"
                      ? "Switch to Delivery Person"
                      : "Switch to Customer"}
                  </Text>
                  <Text style={styles.settingDescription}>
                    {appMode === "customer"
                      ? "Become a delivery person to earn money by delivering food"
                      : "Switch back to customer mode to order food"}
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: "#4f5d75", true: "#e97e67" }}
                  thumbColor="#fff"
                  onValueChange={handleToggleAppMode}
                  value={appMode === "worker"}
                />
              </View>
            </View>

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#ff4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Edit Profile */}
      <Modal visible={editProfileModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editedData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={editedData.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={editedData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setEditProfileModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292f38",
  },
  header: {
    padding: 20,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 25,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e97e67",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 12,
    color: "#ccc",
    opacity: 0.8,
  },
  modeIndicator: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#4f5d75",
  },
  modeLabel: {
    fontSize: 12,
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#3b4957",
    paddingVertical: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#e97e67",
  },
  tabText: {
    color: "#ccc",
    marginLeft: 5,
    fontSize: 14,
  },
  activeTabText: {
    color: "#e97e67",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#292f38",
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#3b4957",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: "#ccc",
  },
  infoValue: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#4f5d75",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  settingsCard: {
    backgroundColor: "#3b4957",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#4f5d75",
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b4957",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  logoutText: {
    color: "#ff4444",
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#3b4957",
    borderRadius: 12,
    padding: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cancelButton: {
    backgroundColor: "#25292e",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#e97e67",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
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
  browseButton: {
    backgroundColor: "#e97e67",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  browseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
