import { View, Text, FlatList, StyleSheet } from "react-native"

const BOOKINGS = [
   {
      id: "1",
      pod: "Tampines Pod",
      user: "John Doe",
      time: "10:00 - 10:30",
      status: "confirmed",
   },
]

export default function AdminBookings() {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>All Bookings</Text>

         <FlatList
            data={BOOKINGS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <View style={styles.card}>
                  <Text style={styles.text}>{item.pod}</Text>
                  <Text style={styles.sub}>{item.user}</Text>
                  <Text style={styles.sub}>{item.time}</Text>
                  <Text style={styles.status}>{item.status}</Text>
               </View>
            )}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#121212", padding: 20 },
   title: { color: "#FF6D00", fontSize: 20, marginBottom: 15 },
   card: {
      backgroundColor: "#2a2a2a",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
   },
   text: { color: "#fff", fontWeight: "bold" },
   sub: { color: "#aaa", fontSize: 12 },
   status: { color: "#FF6D00", marginTop: 5 },
})
