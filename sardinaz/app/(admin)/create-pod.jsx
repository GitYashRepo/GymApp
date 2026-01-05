import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux"
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
   const { loading } = useSelector(state => state.pods)

   const [form, setForm] = useState({
      name: "",
      locationName: "",
      pricePer30Min: "",
      description: "",
      images: []
   })

   const slots = generateSlots()

   const handleCreate = async () => {
      if (!form.name || !form.locationName || !form.pricePer30Min) {
         Alert.alert("Error", "Please fill all required fields")
         return
      }

      const payload = {
         ...form,
         latitude: Number(form.latitude),
         longitude: Number(form.longitude),
         pricePer30Min: Number(form.pricePer30Min),
         slots
      }

      const res = await dispatch(createGymPod(payload))

      if (res.meta.requestStatus === "fulfilled") {
         Alert.alert("Success", "Gym Pod created successfully")
         setForm({
            name: "",
            locationName: "",
            latitude: "",
            longitude: "",
            pricePer30Min: "",
            description: "",
            images: []
         })
      } else {
         Alert.alert("Error", res.payload || "Failed to create pod")
      }
   }

   return (
      <ScrollView style={styles.container}>
         <Text style={styles.title}>Create Gym Pod</Text>

         <TextInput
            placeholder="Pod Name"
            placeholderTextColor="#777"
            style={styles.input}
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
         />

         <TextInput
            placeholder="Location Name"
            placeholderTextColor="#777"
            style={styles.input}
            value={form.locationName}
            onChangeText={(v) => setForm({ ...form, locationName: v })}
         />

         <TextInput
            placeholder="Price per 30 min"
            placeholderTextColor="#777"
            style={styles.input}
            keyboardType="numeric"
            value={form.pricePer30Min}
            onChangeText={(v) => setForm({ ...form, pricePer30Min: v })}
         />

         <TextInput
            placeholder="Description"
            placeholderTextColor="#777"
            style={[styles.input, { height: 90 }]}
            multiline
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
         />

         <Text style={styles.subtitle}>Auto-Generated Slots</Text>

         <View style={styles.slots}>
            {slots.map((s) => (
               <Text key={s} style={styles.slot}>{s}</Text>
            ))}
         </View>

         <TouchableOpacity
            style={styles.button}
            onPress={handleCreate}
            disabled={loading}
         >
            <Text style={styles.buttonText}>
               {loading ? "Creating..." : "Create Pod"}
            </Text>
         </TouchableOpacity>
      </ScrollView>
   )
}


const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#121212", padding: 20 },
   title: { color: "#FF6D00", fontSize: 22, marginBottom: 20 },
   subtitle: { color: "#aaa", marginVertical: 10 },
   input: {
      backgroundColor: "#2a2a2a",
      color: "#fff",
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
   },
   slots: { flexDirection: "row", flexWrap: "wrap" },
   slot: {
      backgroundColor: "#2a2a2a",
      color: "#fff",
      padding: 6,
      borderRadius: 6,
      margin: 4,
      fontSize: 12,
   },
   button: {
      backgroundColor: "#FF6D00",
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 140,
   },
   buttonText: {
      color: "#000",
      fontWeight: "bold",
      textAlign: "center",
   },
});
