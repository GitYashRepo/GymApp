import { Stack, useRouter, usePathname } from "expo-router"
import { useSelector } from "react-redux"
import { useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import { useTranslate } from "../../localization/useTranslate"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"

import TopNavBar from "../../components/TopNavBar"
import SideNavBar from "../../components/SideNavBar"
import LanguageModal from "../../components/LanguageModal"

export default function BookingLayout() {
   const router = useRouter()
   const { user } = useSelector((state) => state.auth)
   const isLoggedIn = !!user

   const [sidebarOpen, setSidebarOpen] = useState(false)
   const [languageModalOpen, setLanguageModalOpen] = useState(false)
   // const [activeTab, setActiveTab] = useState("/")

   const pathname = usePathname()

   const isTabActive = (name) => {
      if (name === "index") return pathname === "/"
      return pathname.startsWith(`/${name}`)
   }


   const t = useTranslate()

   /* ------------------ HANDLERS ------------------ */

   const handleMenuPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setSidebarOpen((prev) => !prev)
   }

   const handleFilterPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setLanguageModalOpen(true)
   }

   const handleNav = (route) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

      if (route === "index") {
         router.replace("/")
      } else {
         router.replace(`/${route}`)
      }
   }

   /* ------------------ NAV ITEM ------------------ */

   const NavItem = ({ name, label, icon }) => {
      const isActive = isTabActive(name);
      return (
         < TouchableOpacity
            style={styles.navItem}
            onPress={() => handleNav(name)
            }
            activeOpacity={0.7}
         >
            <MaterialCommunityIcons
               name={icon}
               size={24}
               color={isActive ? "#FF6D00" : "#999"}
            />
            <Text
               style={[
                  styles.navLabel,
                  isActive && styles.navLabelActive,
               ]}
            >
               {label}
            </Text>
         </ TouchableOpacity>
      )
   }

   /* ------------------ RENDER ------------------ */

   return (
      <View style={styles.container}>
         {/* 🔝 TOP NAV */}
         <TopNavBar
            onMenuPress={handleMenuPress}
            onFilterPress={handleFilterPress}
         />

         {/* 📦 CONTENT */}
         <View style={styles.content}>
            <Stack screenOptions={{ headerShown: false }}>
               <Stack.Screen
                  name="*"
                  options={{ headerShown: false }}
               />
            </Stack>
         </View>

         {/* 🔻 BOTTOM NAV */}
         <View style={styles.bottomNav}>
            <NavItem
               name="index"
               label={t("nav.home") ?? "Home"}
               icon="home"
            />
            <NavItem
               name="content"
               label={t("nav.content") ?? "Content"}
               icon="play-circle"
            />
            <NavItem
               name="help"
               label={t("nav.helpsupport") ?? "Help & Support"}
               icon="help-circle"
            />
            <NavItem
               name={isLoggedIn ? "(tabs)/profile" : "(tabs)/login"}
               label={isLoggedIn ? t("nav.profile") : t("nav.login")}
               icon={isLoggedIn ? "account" : "login"}
            />
         </View>

         {/* 🧭 SIDE NAV */}
         <SideNavBar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
         />

         {/* 🌐 LANGUAGE MODAL */}
         <LanguageModal
            isVisible={languageModalOpen}
            onClose={() => setLanguageModalOpen(false)}
         />
      </View>
   )
}

/* ------------------ STYLES ------------------ */

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
})
