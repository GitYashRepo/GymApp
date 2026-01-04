"use client";

import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useTranslate } from "../localization/useTranslate";

export default function SideNavBar({ isOpen, onClose }) {
   const router = useRouter();
   const { user } = useSelector((state) => state.auth);

   const isAdmin = user?.role === "admin";
   const isLoggedIn = !!user;

   const profileRoute = isAdmin
      ? "/(admin)/profile"
      : isLoggedIn
         ? "profile"
         : "auth";


   // 🔥 Subscribe to language changes
   const locale = useSelector((state) => state.language.locale);

   // 🔥 Reactive translator
   const t = useTranslate();

   const menuItems = [
      { key: "home", icon: "home", route: "home" },
      { key: "bookings", icon: "calendar-check", route: "/bookings" },
      // { key: "favorites", icon: "heart", route: "/favorites" },
      // { key: "settings", icon: "cog", route: "/settings" },
      { key: "help", icon: "help-circle", route: "/help" },
      { key: "profile", icon: "account", route: profileRoute },
   ];

   const handleMenuItemPress = (route) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onClose();
      router.push(route);
   };

   if (!isOpen) return null;

   return (
      <>
         {/* Overlay */}
         <TouchableOpacity style={styles.overlay} onPress={onClose} />

         {/* Sidebar */}
         <View style={styles.sidebar}>
            {/* Header */}
            <View style={styles.header}>
               <Text style={styles.headerTitle}>
                  {t("common.app_name")}
               </Text>
               <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <MaterialCommunityIcons
                     name="close"
                     size={28}
                     color="#FF6D00"
                  />
               </TouchableOpacity>
            </View>

            {/* Menu */}
            <ScrollView style={styles.menuContainer}>
               {menuItems.map((item) => (
                  <TouchableOpacity
                     key={item.key}
                     style={styles.menuItem}
                     onPress={() => handleMenuItemPress(item.route)}
                     activeOpacity={0.7}
                  >
                     <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color="#FF6D00"
                     />
                     <Text style={styles.menuLabel}>
                        {t(`side_nav.${item.key}`)}
                     </Text>
                  </TouchableOpacity>
               ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
               <Text style={styles.versionText}>
                  {t("common.version")} 1.0.0
               </Text>
            </View>
         </View>
      </>
   );
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
      color: "#FF6D00",
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
});
