import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { useState } from "react"

const TIMES = Array.from({ length: 34 }, (_, i) => `${6 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`)

export default function BookingPage() {
   const [selected, setSelected] = useState(null)

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Select Slot</Text>

         <ScrollView horizontal>
            <View>
               {TIMES.map((time) => (
                  <TouchableOpacity
                     key={time}
                     style={[
                        styles.slot,
                        selected === time && styles.selected,
                     ]}
                     onPress={() => setSelected(time)}
                  >
                     <Text style={styles.slotText}>{time}</Text>
                  </TouchableOpacity>
               ))}
            </View>
         </ScrollView>

         {selected && (
            <TouchableOpacity style={styles.bookBtn}>
               <Text style={styles.bookText}>Proceed to Payment</Text>
            </TouchableOpacity>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#121212", padding: 20 },
   title: { color: "#FF6D00", fontSize: 20, marginBottom: 15 },
   slot: {
      backgroundColor: "#000",
      padding: 12,
      marginVertical: 5,
      borderRadius: 6,
   },
   selected: {
      backgroundColor: "#FF6D00",
   },
   slotText: { color: "#fff", fontSize: 14 },
   bookBtn: {
      backgroundColor: "#FF6D00",
      padding: 15,
      borderRadius: 12,
      marginTop: 20,
   },
   bookText: { color: "#000", fontWeight: "bold", textAlign: "center" },
})
