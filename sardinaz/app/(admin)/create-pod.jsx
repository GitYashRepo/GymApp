import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createGymPod } from "../../store/podSlice";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function CreatePod() {
   const dispatch = useDispatch()
   const { loading } = useSelector(state => state.pods)

   const [form, setForm] = useState({
      name: "",
      locationName: "",
      pricePer30Min: "",
      maxCapacity: "",
      description: "",
      image: null,
   })

   const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsMultipleSelection: false,
         quality: 0.7,
      });

      if (!result.canceled) {
         setForm({ ...form, image: result.assets[0] });
      }
   };

   const handleCreate = async () => {
      if (!form.name || !form.locationName || !form.pricePer30Min || !form.image) {
         Alert.alert("Error", "All fields & image are required");
         return;
      }

      const data = new FormData();
      data.append("name", form.name);
      data.append("locationName", form.locationName);
      data.append("pricePer30Min", String(form.pricePer30Min));
      data.append("maxCapacity", String(form.maxCapacity || 3));
      data.append("description", form.description);

      data.append("image", {
         uri: form.image.uri,
         name: form.image.fileName || "gym-pod.jpg",
         type: form.image.mimeType || "image/jpeg",
      });


      const res = await dispatch(createGymPod(data));

      if (res.meta.requestStatus === "fulfilled") {
         Alert.alert("Success", "Gym Pod created successfully");
         setForm({
            name: "",
            locationName: "",
            pricePer30Min: "",
            maxCapacity: "",
            description: "",
            image: null,
         });
      } else {
         Alert.alert("Error", res.payload || "Failed to create pod");
      }
   };

   return (
      <ScrollView style={styles.container}>
         <Text style={styles.title}>Create Gym Pod</Text>

         <TextInput
            style={styles.input}
            placeholder="Pod Name"
            placeholderTextColor="#777"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
         />

         <TextInput
            style={styles.input}
            placeholder="Location Name"
            placeholderTextColor="#777"
            value={form.locationName}
            onChangeText={(v) => setForm({ ...form, locationName: v })}
         />

         <TextInput
            style={styles.input}
            placeholder="Price per 30 min"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={form.pricePer30Min}
            onChangeText={(v) => setForm({ ...form, pricePer30Min: v })}
         />

         <TextInput
            style={styles.input}
            placeholder="Max Capacity"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={form.maxCapacity}
            onChangeText={(v) => setForm({ ...form, maxCapacity: v })}
         />

         <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description"
            placeholderTextColor="#777"
            multiline
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
         />

         <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>Pick Image</Text>
         </TouchableOpacity>

         {form.image && (
            <Image source={{ uri: form.image.uri }} style={styles.preview} />
         )}

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
   );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#121212", padding: 20 },
   title: { color: "#FF6D00", fontSize: 22, marginBottom: 20 },

   input: {
      backgroundColor: "#2a2a2a",
      color: "#fff",
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
   },

   imageBtn: {
      backgroundColor: "#333",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 10,
   },

   imageBtnText: {
      color: "#FF6D00",
      fontWeight: "bold",
   },

   preview: {
      width: "100%",
      height: 180,
      borderRadius: 10,
      marginBottom: 12,
   },

   button: {
      backgroundColor: "#FF6D00",
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 120,
   },

   buttonText: {
      color: "#000",
      fontWeight: "bold",
      textAlign: "center",
   },
});
