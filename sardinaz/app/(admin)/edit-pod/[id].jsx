import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   ScrollView,
   Alert,
   Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateGymPod } from "../../../store/podSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function EditPod() {
   const { id } = useLocalSearchParams();
   const router = useRouter();
   const dispatch = useDispatch();
   const { adminPods, loading } = useSelector((state) => state.pods);

   const pod = adminPods.find((p) => p._id === id);

   const [form, setForm] = useState({
      name: "",
      locationName: "",
      pricePer30Min: "",
      maxCapacity: "",
      description: "",
      image: null, // ✅ single new image
   });

   /* ---------------- PREFILL ---------------- */
   useEffect(() => {
      if (pod) {
         setForm({
            name: pod.name,
            locationName: pod.locationName,
            pricePer30Min: String(pod.pricePer30Min),
            maxCapacity: String(pod.maxCapacity),
            description: pod.description || "",
            image: null,
         });
      }
   }, [pod]);

   /* ---------------- IMAGE PICKER ---------------- */
   const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsMultipleSelection: false,
         quality: 0.7,
      });

      if (!result.canceled) {
         setForm((prev) => ({
            ...prev,
            image: result.assets[0],
         }));
      }
   };

   /* ---------------- SUBMIT ---------------- */
   const handleUpdate = async () => {
      const data = new FormData();

      data.append("name", form.name);
      data.append("locationName", form.locationName);
      data.append("pricePer30Min", form.pricePer30Min);
      data.append("maxCapacity", form.maxCapacity);
      data.append("description", form.description);

      // ✅ only append image if user selected one
      if (form.image) {
         data.append("image", {
            uri: form.image.uri,
            name: form.image.fileName || "gym-pod.jpg",
            type: form.image.mimeType || "image/jpeg",
         });
      }

      const res = await dispatch(updateGymPod({ id, data }));

      if (res.meta.requestStatus === "fulfilled") {
         Alert.alert("Success", "Pod updated successfully");
         router.back();
      } else {
         Alert.alert("Error", res.payload || "Update failed");
      }
   };

   if (!pod) {
      return (
         <View style={styles.center}>
            <Text style={{ color: "#fff" }}>Loading pod...</Text>
         </View>
      );
   }

   return (
      <ScrollView style={styles.container}>
         <Text style={styles.title}>Edit Gym Pod</Text>

         <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
            placeholder="Pod Name"
            placeholderTextColor="#777"
         />

         <TextInput
            style={styles.input}
            value={form.locationName}
            onChangeText={(v) => setForm({ ...form, locationName: v })}
            placeholder="Location"
            placeholderTextColor="#777"
         />

         <TextInput
            style={styles.input}
            value={form.pricePer30Min}
            onChangeText={(v) => setForm({ ...form, pricePer30Min: v })}
            keyboardType="numeric"
            placeholder="Price per 30 min"
            placeholderTextColor="#777"
         />

         <TextInput
            style={styles.input}
            value={form.maxCapacity}
            onChangeText={(v) => setForm({ ...form, maxCapacity: v })}
            keyboardType="numeric"
            placeholder="Max Capacity"
            placeholderTextColor="#777"
         />

         <TextInput
            style={[styles.input, { height: 90 }]}
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
            multiline
            placeholder="Description"
            placeholderTextColor="#777"
         />

         {/* EXISTING IMAGES */}
         <Text style={styles.subtitle}>Current Images</Text>
         <View style={styles.imageRow}>
            {pod.images?.map((img, i) => (
               <Image key={i} source={{ uri: img }} style={styles.image} />
            ))}
         </View>

         {/* NEW IMAGE */}
         <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>Replace / Add Image</Text>
         </TouchableOpacity>

         {form.image && (
            <Image source={{ uri: form.image.uri }} style={styles.preview} />
         )}

         <TouchableOpacity
            style={styles.button}
            onPress={handleUpdate}
            disabled={loading}
         >
            <Text style={styles.buttonText}>
               {loading ? "Updating..." : "Update Pod"}
            </Text>
         </TouchableOpacity>
      </ScrollView>
   );
}

/* ---------------- STYLES ---------------- */
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

   imageBtn: {
      backgroundColor: "#333",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 10,
   },

   imageBtnText: { color: "#FF6D00", fontWeight: "bold" },

   imageRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 10,
   },

   image: {
      width: 70,
      height: 70,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
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

   center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#121212",
   },
});
