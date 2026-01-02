import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"

export default function TopNavBar({ onMenuPress, onFilterPress }) {
   const handleMenuPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onMenuPress?.()
   }

   const handleFilterPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onFilterPress?.()
   }

   return (
      <View style={styles.header}>
         <TouchableOpacity onPress={handleMenuPress} activeOpacity={0.7}>
            <MaterialCommunityIcons name="menu" size={28} color="#000" />
         </TouchableOpacity>
         <Text style={styles.title}>SARDINAZ GYM</Text>
         <TouchableOpacity onPress={handleFilterPress} activeOpacity={0.7}>
            <MaterialCommunityIcons name="tune" size={28} color="#000" />
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   header: {
      backgroundColor: "#FF6D00",
      paddingTop: 35,
      paddingBottom: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   title: {
      fontSize: 20,
      fontWeight: "700",
      color: "#000",
      flex: 1,
      textAlign: "center",
   },
})
