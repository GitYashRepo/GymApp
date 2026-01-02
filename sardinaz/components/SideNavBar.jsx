"use client"

import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { useRouter } from "expo-router"

export default function SideNavBar({ isOpen, onClose }) {
   const router = useRouter()

   const menuItems = [
      { label: "Home", icon: "home", route: "/" },
      { label: "My Bookings", icon: "calendar-check", route: "/bookings" },
      { label: "Favorites", icon: "heart", route: "/favorites" },
      { label: "Settings", icon: "cog", route: "/settings" },
      { label: "Help & Support", icon: "help-circle", route: "/help" },
      { label: "About", icon: "information", route: "/about" },
   ]

   const handleMenuItemPress = (route) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onClose()
      router.push(route)
   }

   if (!isOpen) return null

   return (
      <>
         {/* Overlay */}
         <TouchableOpacity style={styles.overlay} onPress={onClose} />

         {/* Sidebar */}
         <View style={styles.sidebar}>
            <View style={styles.header}>
               <Text style={styles.headerTitle}>The Gym Pod</Text>
               <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="close" size={28} color="#FFD500" />
               </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuContainer}>
               {menuItems.map((item, index) => (
                  <TouchableOpacity
                     key={index}
                     style={styles.menuItem}
                     onPress={() => handleMenuItemPress(item.route)}
                     activeOpacity={0.7}
                  >
                     <MaterialCommunityIcons name={item.icon} size={24} color="#FFD500" />
                     <Text style={styles.menuLabel}>{item.label}</Text>
                  </TouchableOpacity>
               ))}
            </ScrollView>

            <View style={styles.footer}>
               <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
         </View>
      </>
   )
}

const styles = StyleSheet.create({
   overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1,
   },
   sidebar: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: "75%",
      backgroundColor: "#222",
      zIndex: 2,
      paddingTop: 36,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#333",
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFD500",
   },
   menuContainer: {
      flex: 1,
      paddingVertical: 12,
   },
   menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#333",
   },
   menuLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
      marginLeft: 16,
   },
   footer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: "#333",
   },
   versionText: {
      fontSize: 12,
      color: "#666",
   },
})
