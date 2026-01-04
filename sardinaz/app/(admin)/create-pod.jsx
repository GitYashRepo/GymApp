import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { useDispatch } from "react-redux"
import { createGymPod } from "../../store/podSlice"
import { useState } from "react"

const generateSlots = () => {
   const slots = []
   let hour = 6
   let min = 0

   while (hour < 23) {
      slots.push(`${hour}:${min === 0 ? "00" : min}`)
      min += 30
      if (min === 60) {
         min = 0
         hour++
      }
   }
   return slots
}

export default function CreatePod() {
   const dispatch = useDispatch()
   const [form, setForm] = useState({
      name: "",
      locationName: "",
      pricePer30Min: "",
      description: "",
   })

   const slots = generateSlots()

   const handleCreate = () => {
      dispatch(createGymPod(form))
   }

   return (
      <ScrollView style={styles.container}>
         <Text style={styles.title}>Create GymPod</Text>

         {["name", "locationName", "pricePer30Min", "description"].map((f) => (
            <TextInput
               key={f}
               placeholder={f}
               placeholderTextColor="#777"
               style={styles.input}
               onChangeText={(v) => setForm({ ...form, [f]: v })}
            />
         ))}

         <Text style={styles.subtitle}>Auto-Generated Slots</Text>

         <View style={styles.slots}>
            {slots.map((s) => (
               <Text key={s} style={styles.slot}>{s}</Text>
            ))}
         </View>

         <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create Pod</Text>
         </TouchableOpacity>
      </ScrollView>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#121212", padding: 20 },
   title: { color: "#FF6D00", fontSize: 22, marginBottom: 20 },
   subtitle: { color: "#aaa", marginVertical: 10 },
   input: { backgroundColor: "#2a2a2a", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 },
   slots: { flexDirection: "row", flexWrap: "wrap" },
   slot: {
      backgroundColor: "#2a2a2a",
      color: "#fff",
      padding: 6,
      borderRadius: 6,
      margin: 4,
      fontSize: 12,
   },
   button: { backgroundColor: "#FF6D00", padding: 15, borderRadius: 10, marginTop: 20 },
   buttonText: { color: "#000", fontWeight: "bold", textAlign: "center" },
})
