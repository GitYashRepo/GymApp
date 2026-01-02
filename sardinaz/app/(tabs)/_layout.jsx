import { Tabs, useRouter } from "expo-router"
import { useState } from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import * as Haptics from "expo-haptics"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import TopNavBar from "../../components/TopNavBar"
import SideNavBar from "../../components/SideNavBar"
import LanguageModal from "../../components/LanguageModal"

export default function TabLayout() {
   const [activeTab, setActiveTab] = useState("home")
   const [sidebarOpen, setSidebarOpen] = useState(false)
   const [languageModalOpen, setLanguageModalOpen] = useState(false)
   const [selectedLanguage, setSelectedLanguage] = useState("en")
   const router = useRouter()

   const handleTabPress = (tabName) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      setActiveTab(tabName)
      router.push(tabName)
   }

   const handleMenuPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setSidebarOpen(!sidebarOpen)
   }

   const handleFilterPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setLanguageModalOpen(true)
   }

   const handleLanguageSelect = (language) => {
      setSelectedLanguage(language)
      console.log("[v0] Language selected:", language)
   }

   const NavButton = ({ name, label, iconName }) => {
      const isActive = activeTab === name
      return (
         <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress(name)} activeOpacity={0.7}>
            <MaterialCommunityIcons name={iconName} size={24} color={isActive ? "#FFD500" : "#999"} />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
         </TouchableOpacity>
      )
   }

   return (
      <View style={styles.container}>
         <TopNavBar onMenuPress={handleMenuPress} onFilterPress={handleFilterPress} />

         <View style={styles.contentContainer}>
            <Tabs
               screenOptions={{
                  headerShown: false,
                  tabBarStyle: { display: "none" },
               }}
            >
               <Tabs.Screen
                  name="home"
                  options={{
                     title: "Home",
                  }}
               />
               {/* <Tabs.Screen
                  name="pods"
                  options={{
                     title: "Pods",
                  }}
               /> */}
               <Tabs.Screen
                  name="classes"
                  options={{
                     title: "Classes",
                  }}
               />
               <Tabs.Screen
                  name="content"
                  options={{
                     title: "Content",
                  }}
               />
               <Tabs.Screen
                  name="profile"
                  options={{
                     title: "Profile",
                  }}
               />
            </Tabs>
         </View>

         {/* Custom Bottom Navigation */}
         <View style={styles.bottomNav}>
            <NavButton name="home" label="Home" iconName="home" />
            {/* <NavButton name="pods" label="Pods" iconName="grid" /> */}
            <NavButton name="classes" label="Classes" iconName="dumbbell" />
            <NavButton name="content" label="Content" iconName="play-circle" />
            <NavButton name="profile" label="Profile" iconName="account" />
         </View>

         <SideNavBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
         <LanguageModal
            isVisible={languageModalOpen}
            onClose={() => setLanguageModalOpen(false)}
            onSelectLanguage={handleLanguageSelect}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   contentContainer: {
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
      color: "#FFD500",
   },
})
