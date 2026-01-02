import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function ProfileScreen() {
   const userInfo = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      memberSince: "January 2024",
      avatar: "https://via.placeholder.com/150?text=JD",
   }

   const stats = [
      { icon: "dumbbell", label: "Classes Attended", value: "24" },
      { icon: "heart", label: "Favorite Pods", value: "8" },
      { icon: "calendar-check", label: "Bookings", value: "12" },
   ]

   const menuOptions = [
      { icon: "calendar", label: "My Bookings" },
      { icon: "heart", label: "Favorites" },
      { icon: "bell", label: "Notifications" },
      { icon: "cog", label: "Settings" },
      { icon: "lock", label: "Privacy & Security" },
      { icon: "help-circle", label: "Help & Support" },
   ]

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
               <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
               <Text style={styles.name}>{userInfo.name}</Text>
               <Text style={styles.email}>{userInfo.email}</Text>
               <Text style={styles.memberSince}>Member since {userInfo.memberSince}</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
               {stats.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                     <MaterialCommunityIcons name={stat.icon} size={24} color="#FFD500" />
                     <Text style={styles.statValue}>{stat.value}</Text>
                     <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
               ))}
            </View>

            {/* Menu Options */}
            <View style={styles.menuSection}>
               {menuOptions.map((option, index) => (
                  <TouchableOpacity key={index} style={styles.menuOption} activeOpacity={0.7}>
                     <MaterialCommunityIcons name={option.icon} size={20} color="#FFD500" />
                     <Text style={styles.menuLabel}>{option.label}</Text>
                     <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
                  </TouchableOpacity>
               ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
               <MaterialCommunityIcons name="logout" size={20} color="#fff" />
               <Text style={styles.logoutBtnText}>LOGOUT</Text>
            </TouchableOpacity>
         </ScrollView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#1a1a1a",
   },
   content: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      paddingBottom: 80,
   },
   profileHeader: {
      alignItems: "center",
      marginBottom: 24,
   },
   avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 12,
      borderWidth: 3,
      borderColor: "#FFD500",
   },
   name: {
      fontSize: 22,
      fontWeight: "700",
      color: "#FFD500",
      marginBottom: 4,
   },
   email: {
      fontSize: 14,
      color: "#999",
      marginBottom: 2,
   },
   memberSince: {
      fontSize: 12,
      color: "#666",
      marginTop: 4,
   },
   statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: "#222",
      borderRadius: 12,
      paddingVertical: 16,
      marginBottom: 24,
   },
   statItem: {
      alignItems: "center",
   },
   statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFD500",
      marginVertical: 4,
   },
   statLabel: {
      fontSize: 12,
      color: "#999",
   },
   menuSection: {
      marginBottom: 24,
   },
   menuOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 12,
      backgroundColor: "#222",
      borderRadius: 10,
      marginBottom: 8,
   },
   menuLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      color: "#fff",
      marginLeft: 12,
   },
   logoutBtn: {
      backgroundColor: "#ff3b30",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 14,
      borderRadius: 10,
   },
   logoutBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      marginLeft: 8,
      letterSpacing: 1,
   },
})
