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
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

// Mock data
const userData = {
  name: "John Smith",
  email: "john.smith@student.unsw.edu.au",
  phone: "0412 345 678",
  location: "Upper Campus, UNSW Sydney",
  memberSince: "March 2025",
  orders: [
    {
      id: "1234",
      restaurant: "Yallah",
      items: "HSP with extra sauce",
      date: "24 March 2025",
      price: "$18.50",
      status: "delivered",
    },
    {
      id: "1235",
      restaurant: "Tropical Green",
      items: "Pho with chicken",
      date: "23 March 2025",
      price: "$14.90",
      status: "delivered",
    },
    {
      id: "1236",
      restaurant: "Soul Origin",
      items: "Turkey & Cranberry Sandwich",
      date: "20 March 2025",
      price: "$9.90",
      status: "cancelled",
    },
  ],
};

const notifications = [
  {
    id: "1",
    title: "Order Delivered",
    date: "24 March 2025",
    description: "Your HSP with extra sauce has been delivered.",
  },
  {
    id: "2",
    title: "Order Cancelled",
    date: "23 March 2025",
    description: "Your Pho with chicken order was cancelled.",
  },
  {
    id: "3",
    title: "New Promotion",
    date: "20 March 2025",
    description: "Lunch is on us! 20% off your next order at Yallah!",
  },
];

export default function AccountScreen() {
  const [activeSection, setActiveSection] = useState("personal");
  const { appMode, setAppMode } = useAppContext();

  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [notificationModal, setNotificationModal] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    deliveryNotifications: true,
    promotionalNotifications: false,
  });
  const [isPrivateProfile, setIsPrivateProfile] = useState(false); // State to track profile visibility
  const [privacyModal, setPrivacyModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

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

  const openNotificationModal = () => {
    setNotificationModal(!notificationModal);
  };

  const openPrivacyModal = () => {
    setPrivacyModal(!privacyModal);
  };

  const openHelpModal = () => {
    setHelpModal(!helpModal);
  };

  const handleSaveChanges = () => {
    setEditProfileModal(false);
    setNotificationModal(false);
    setPrivacyModal(false);
    setHelpModal(false);
  };

  const changeNotificationSettings = (
    type: "deliveryNotifications" | "promotionalNotifications"
  ) => {
    setNotificationSettings({
      ...notificationSettings,
      [type]: !notificationSettings[type],
    });
  };

  const handleProfileToggle = () => {
    setIsPrivateProfile(!isPrivateProfile);
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
            await SecureStore.deleteItemAsync("authToken");
            router.replace("/auth");
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
          <Text style={styles.profileInitials}>{userData.name.charAt(0)}</Text>
        </View>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.memberSince}>
          Member since {userData.memberSince}
        </Text>
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
                  <Text style={styles.infoValue}>{userData.phone}</Text>
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
                  <Text style={styles.infoValue}>{userData.email}</Text>
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
                  <Text style={styles.infoValue}>{userData.location}</Text>
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

            {userData.orders.map((order, index) => (
              <View key={index} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.restaurantName}>{order.restaurant}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      order.status === "delivered"
                        ? styles.deliveredBadge
                        : styles.cancelledBadge,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {order.status === "delivered" ? "Delivered" : "Cancelled"}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetail}>
                  <Text style={styles.orderItems}>{order.items}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                  <View style={styles.orderPriceRow}>
                    <Text style={styles.orderPrice}>{order.price}</Text>
                    <Pressable style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>View Details</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
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

              <Pressable
                style={styles.settingRow}
                onPress={openNotificationModal}
              >
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#e97e67"
                  style={styles.settingIcon}
                />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Manage delivery and promotional notifications
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </Pressable>

              <Pressable style={styles.settingRow}>
                <Ionicons
                  name="card-outline"
                  size={22}
                  color="#e97e67"
                  style={styles.settingIcon}
                />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Payment Methods</Text>
                  <Text style={styles.settingDescription}>
                    Add or edit payment methods
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </Pressable>

              <Pressable style={styles.settingRow} onPress={openPrivacyModal}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#e97e67"
                  style={styles.settingIcon}
                />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Privacy</Text>
                  <Text style={styles.settingDescription}>
                    Manage privacy settings and data
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </Pressable>

              <Pressable style={styles.settingRow} onPress={openHelpModal}>
                <Ionicons
                  name="help-circle-outline"
                  size={22}
                  color="#e97e67"
                  style={styles.settingIcon}
                />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Help & Support</Text>
                  <Text style={styles.settingDescription}>
                    Contact customer service
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </Pressable>
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

      {/* Update notification settings */}
      <Modal visible={notificationModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>

            {/* Notification History */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Notification History</Text>
              <ScrollView style={styles.notificationHistoryContainer}>
                {notifications.map((notification) => (
                  <View key={notification.id} style={styles.notificationCard}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationDate}>
                      {notification.date}
                    </Text>
                    <Text style={styles.notificationDescription}>
                      {notification.description}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Notification Settings */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Notification Settings</Text>
              <View style={styles.notifRow}>
                <View style={styles.type}>
                  <Text style={styles.settingTitle}>
                    Delivery Notifications
                  </Text>
                  <Switch
                    value={notificationSettings.deliveryNotifications}
                    onValueChange={() =>
                      changeNotificationSettings("deliveryNotifications")
                    }
                    trackColor={{ false: "#4f5d75", true: "#e97e67" }}
                    thumbColor="#fff"
                  />
                </View>
                <View style={styles.type}>
                  <Text style={styles.settingTitle}>
                    Promotional Notifications
                  </Text>
                  <Switch
                    value={notificationSettings.promotionalNotifications}
                    onValueChange={() =>
                      changeNotificationSettings("promotionalNotifications")
                    }
                    trackColor={{ false: "#4f5d75", true: "#e97e67" }}
                    thumbColor="#fff"
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={openNotificationModal}
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

      {/* Privacy settings */}
      <Modal visible={privacyModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Privacy and Data Center</Text>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Privacy Settings</Text>
              <View style={styles.profileRow}>
                <Text style={styles.settingTitle}>Profile Visibility</Text>
                <Switch
                  value={isPrivateProfile}
                  onValueChange={handleProfileToggle}
                  trackColor={{ false: "#4f5d75", true: "#e97e67" }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={openPrivacyModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Help settings */}
      <Modal visible={helpModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Help Center</Text>
            {/* Conact Us */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Contact Us</Text>
              <View style={styles.helpCard}>
                <Text style={styles.helpCardTitle}>Call Us</Text>
                <Text style={styles.helpCardDescription}>XXXX-XXX-XXX</Text>
                <Text style={styles.helpCardDescription}>
                  8am–6pm, Monday–Friday (except national public holidays).
                </Text>
              </View>
              <View style={styles.helpCard}>
                <Text style={styles.helpCardTitle}>Enquire Online</Text>
                <Text style={styles.helpCardDescription}>fatcow@gmail.com</Text>
                <Text style={styles.helpCardDescription}>
                  Tell us the important details and we'll be in touch.
                </Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={openHelpModal}>
                <Text style={styles.buttonText}>Close</Text>
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
  orderCard: {
    backgroundColor: "#3b4957",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#4f5d75",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  deliveredBadge: {
    backgroundColor: "#2ecc71",
  },
  cancelledBadge: {
    backgroundColor: "#e74c3c",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  orderDetail: {
    padding: 16,
  },
  orderItems: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 12,
    color: "#ccc",
    marginBottom: 12,
  },
  orderPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e97e67",
  },
  viewButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4f5d75",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewButtonText: {
    color: "#ccc",
    fontSize: 12,
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
    backgroundColor: "#25292e",
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
    color: "grey",
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
  notificationHistoryContainer: {
    maxHeight: 200,
  },
  notificationCard: {
    backgroundColor: "#292f38",
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  notificationDate: {
    fontSize: 12,
    color: "#ccc",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#ccc",
  },
  notifRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
  },
  type: {
    flexDirection: "row",
    gap: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  helpCard: {
    backgroundColor: "#292f38",
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
    gap: 10,
  },
  helpCardTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  helpCardDescription: {
    fontSize: 13,
    color: "#fff",
  },
});
