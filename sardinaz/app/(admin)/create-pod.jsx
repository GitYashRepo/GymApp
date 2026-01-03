import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { useState } from "react"

export default function CreatePod() {
   const [form, setForm] = useState({
      name: "",
      locationName: "",
      pricePer30Min: "",
      description: "",
   })

   const handleCreate = () => {
      console.log("Create pod:", form)
      // dispatch(createGymPod(form))
   }

   return (
      <ScrollView style={styles.container}>
         <Text style={styles.title}>Create GymPod</Text>

         {["name", "locationName", "pricePer30Min", "description"].map((field) => (
            <TextInput
               key={field}
               placeholder={field}
               placeholderTextColor="#777"
               value={form[field]}
               onChangeText={(v) => setForm({ ...form, [field]: v })}
               style={styles.input}
            />
         ))}

         <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create Pod</Text>
         </TouchableOpacity>
      </ScrollView>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#121212", padding: 20 },
   title: { color: "#FF6D00", fontSize: 20, fontWeight: "bold", marginBottom: 20 },
   input: {
      backgroundColor: "#2a2a2a",
      color: "#fff",
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
   },
   button: {
      backgroundColor: "#FF6D00",
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
   },
   buttonText: { color: "#000", fontWeight: "bold", textAlign: "center" },
})
