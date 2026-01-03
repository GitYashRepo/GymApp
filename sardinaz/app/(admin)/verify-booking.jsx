import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"

export default function VerifyBooking() {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>Payment Verification</Text>

         <View style={styles.card}>
            <Text style={styles.text}>User: John Doe</Text>
            <Text style={styles.text}>Slot: 10:00 - 10:30</Text>

            <Image
               source={{ uri: "https://via.placeholder.com/200" }}
               style={styles.image}
            />

            <View style={styles.actions}>
               <TouchableOpacity style={styles.approve}>
                  <Text>Approve</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.reject}>
                  <Text>Reject</Text>
               </TouchableOpacity>
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#121212", padding: 20 },
   title: { color: "#FF6D00", fontSize: 20, marginBottom: 15 },
   card: { backgroundColor: "#2a2a2a", padding: 15, borderRadius: 10 },
   text: { color: "#fff", marginBottom: 6 },
   image: { height: 200, borderRadius: 10, marginVertical: 10 },
   actions: { flexDirection: "row", justifyContent: "space-between" },
   approve: { backgroundColor: "#FF6D00", padding: 10, borderRadius: 8 },
   reject: { backgroundColor: "#444", padding: 10, borderRadius: 8 },
})
