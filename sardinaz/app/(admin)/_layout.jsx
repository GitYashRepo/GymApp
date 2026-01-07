import { Stack, useRouter } from "expo-router"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"

import TopNavBar from "../../components/TopNavBar"
import SideNavBar from "../../components/SideNavBar"
import LanguageModal from "../../components/LanguageModal"

export default function AdminLayout() {
   const router = useRouter()
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [languageModalOpen, setLanguageModalOpen] = useState(false);
   const { user } = useSelector(state => state.auth)
   const [activeTab, setActiveTab] = useState("profile")

   const handleMenuPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSidebarOpen(!sidebarOpen);
   };

   const handleFilterPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setLanguageModalOpen(true);
   };

   // 🔐 Protect admin routes
   useEffect(() => {
      if (!user || user.role !== "admin") {
         router.replace("/(tabs)/login")
      }
   }, [user])

   const handleNav = (route) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      if (route === "home") {
         setActiveTab("home")
         router.replace("/(tabs)/home")
         return
      }
      setActiveTab(route)
      router.push(`/(admin)/${route}`)
   }

   const NavItem = ({ name, label, icon }) => (
      <TouchableOpacity
         style={styles.navItem}
         onPress={() => handleNav(name)}
         activeOpacity={0.7}
      >
         <MaterialCommunityIcons
            name={icon}
            size={24}
            color={activeTab === name ? "#FF6D00" : "#999"}
         />
         <Text
            style={[
               styles.navLabel,
               activeTab === name && styles.navLabelActive,
            ]}
         >
            {label}
         </Text>
      </TouchableOpacity>
   )

   return (
      <View style={styles.container}>
         {/* 🔝 TOP NAV */}
         <TopNavBar
            onMenuPress={handleMenuPress}
            onFilterPress={handleFilterPress}
         />

         {/* 🧭 ADMIN SCREENS */}
         <View style={styles.content}>
            <Stack screenOptions={{ headerShown: false }}>
               <Stack.Screen
                  name="*"
                  options={{ headerShown: false }}
               />
            </Stack>
         </View>

         {/* 🔻 ADMIN BOTTOM NAV */}
         <View style={styles.bottomNav}>
            <NavItem
               name="home"
               label="Home"
               icon="home"
            />
            <NavItem
               name="create-pod"
               label="Create Pod"
               icon="plus-box"
            />
            <NavItem
               name="pods-card"
               label="My Pods"
               icon="view-list"
            />
            <NavItem
               name="dashboard"
               label="Dashboard"
               icon="view-dashboard"
            />
            <NavItem
               name="profile"
               label="Profile"
               icon="account"
            />
         </View>

         <SideNavBar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
         />

         <LanguageModal
            isVisible={languageModalOpen}
            onClose={() => setLanguageModalOpen(false)}
         />
      </View>
   )
}


const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#121212",
   },
   content: {
      flex: 1,
   },
   bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#222",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 12,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderTopColor: "#333",
   },
   navItem: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      paddingVertical: 4,
   },
   navLabel: {
      fontSize: 11,
      color: "#999",
      marginTop: 4,
   },
   navLabelActive: {
      color: "#FF6D00",
   },
});
