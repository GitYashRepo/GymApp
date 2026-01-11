import { Tabs, useRouter } from "expo-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslate } from "../../localization/useTranslate";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TopNavBar from "../../components/TopNavBar";
import SideNavBar from "../../components/SideNavBar";
import LanguageModal from "../../components/LanguageModal";
import { usePathname } from "expo-router";



export default function TabLayout() {
   const { user } = useSelector((state) => state.auth)
   const isAdmin = user?.role === "admin"
   const isLoggedIn = !!user
   // const [activeTab, setActiveTab] = useState("index");
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [languageModalOpen, setLanguageModalOpen] = useState(false);

   const router = useRouter();

   // 🔥 Force re-render on language change
   const locale = useSelector((state) => state.language.locale);

   const pathname = usePathname();

   const isTabActive = (name) => {
      if (name === "index") return pathname === "/";
      return pathname.startsWith(`/${name}`);
   };


   const profileRoute = isAdmin
      ? "/(admin)/profile"
      : isLoggedIn
         ? "profile"
         : "auth"
   const t = useTranslate();

   const handleTabPress = (tabName) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (tabName === "profile" && isAdmin) {
         router.replace(profileRoute)
         return
      }
      if (tabName === "index") {
         router.replace("/"); // root
      } else {
         router.replace(`/${tabName}`);
      }
      // setActiveTab(tabName);
      // router.push(tabName);
   };

   const handleMenuPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSidebarOpen(!sidebarOpen);
   };

   const handleFilterPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setLanguageModalOpen(true);
   };

   const NavButton = ({ name, label, iconName }) => {
      const isActive = isTabActive(name);

      return (
         <TouchableOpacity
            style={styles.navItem}
            onPress={() => handleTabPress(name)}
            activeOpacity={0.7}
         >
            <MaterialCommunityIcons
               name={iconName}
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
         </TouchableOpacity>
      );
   };

   return (
      <View style={styles.container}>
         <TopNavBar
            onMenuPress={handleMenuPress}
            onFilterPress={handleFilterPress}
         />

         <View style={styles.contentContainer}>
            <Tabs
               screenOptions={{
                  headerShown: false,
                  tabBarStyle: { display: "none" },
               }}
            >
               <Tabs.Screen
                  name="index"
                  options={{ title: t("nav.home") }}
               />
               {/* <Tabs.Screen
                  name="classes"
                  options={{ title: t("nav.classes") }}
               /> */}
               <Tabs.Screen
                  name="content"
                  options={{ title: t("nav.content") }}
               />
               <Tabs.Screen
                  name="help"
                  options={{ title: t("nav.helpsupport") }}
               />
               <Tabs.Screen
                  name={isLoggedIn ? "profile" : "auth"}
                  options={{
                     title: isLoggedIn ? t("nav.profile") : t("nav.login"),
                  }}
               />
            </Tabs>
         </View>

         {/* 🔥 Custom Bottom Navigation */}
         <View style={styles.bottomNav}>
            <NavButton
               name="index"
               label={t("nav.home")}
               iconName="home"
            />
            {/*<NavButton
               name="classes"
               label={t("nav.classes")}
               iconName="dumbbell"
            />*/}
            <NavButton
               name="content"
               label={t("nav.content")}
               iconName="play-circle"
            />
            <NavButton
               name="help"
               label={t("nav.helpsupport")}
               iconName="help-circle"
            />
            <NavButton
               name={isLoggedIn ? "profile" : "auth"}
               label={isLoggedIn ? t("nav.profile") : t("nav.login")}
               iconName={isLoggedIn ? "account" : "login"}
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
   );
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
      color: "#FF6D00",
   },
});
