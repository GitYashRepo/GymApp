import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"

export default function AdminDashboard() {
   const router = useRouter()

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Admin Dashboard</Text>

         <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(admin)/create-pod")}
         >
            <Text style={styles.cardText}>➕ Create GymPod</Text>
         </TouchableOpacity>

         <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(admin)/bookings")}
         >
            <Text style={styles.cardText}>📋 View Bookings</Text>
         </TouchableOpacity>

         <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(admin)/verify-booking")}
         >
            <Text style={styles.cardText}>✅ Verify Payments</Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#121212",
      padding: 20,
   },
   title: {
      fontSize: 22,
      color: "#FF6D00",
      fontWeight: "bold",
      marginBottom: 20,
   },
   card: {
      backgroundColor: "#2a2a2a",
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
   },
   cardText: {
      fontSize: 16,
      color: "#fff",
      fontWeight: "600",
   },
})
