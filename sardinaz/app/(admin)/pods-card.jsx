import {
   View,
   Text,
   FlatList,
   TouchableOpacity,
   StyleSheet,
   Alert,
} from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPods, deletePod } from "../../store/podSlice";
import { useRouter } from "expo-router";

export default function PodsCard() {
   const dispatch = useDispatch();
   const router = useRouter();
   const { adminPods, loading } = useSelector((state) => state.pods);

   useEffect(() => {
      dispatch(fetchAdminPods());
   }, []);

   const handleDelete = (id) => {
      Alert.alert("Delete Pod", "Are you sure you want to delete this pod?", [
         { text: "Cancel", style: "cancel" },
         {
            text: "Delete",
            style: "destructive",
            onPress: () => dispatch(deletePod(id)),
         },
      ]);
   };

   const renderItem = ({ item }) => (
      <View style={styles.card}>
         <Text style={styles.title}>{item.name}</Text>

         <Text style={styles.text}>
            📍 {item.locationName}
         </Text>

         <Text style={styles.text}>
            👥 Capacity: {item.maxCapacity}
         </Text>

         <View style={styles.actions}>
            <TouchableOpacity
               style={styles.editBtn}
               onPress={() => router.push(`/(admin)/edit-pod/${item._id}`)}
            >
               <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={styles.deleteBtn}
               onPress={() => handleDelete(item._id)}
            >
               <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
         </View>
      </View>
   );

   return (
      <View style={styles.container}>
         <Text style={styles.pageTitle}>My Gym Pods</Text>

         <FlatList
            data={adminPods}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
               !loading && (
                  <Text style={styles.emptyText}>
                     No gym pods created yet.
                  </Text>
               )
            }
         />
      </View>
   );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#121212",
      padding: 16,
   },

   pageTitle: {
      color: "#FF6D00",
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
   },

   list: {
      paddingBottom: 140,
   },

   card: {
      backgroundColor: "#1E1E1E",
      padding: 16,
      borderRadius: 12,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: "#2a2a2a",
   },

   title: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 6,
   },

   text: {
      color: "#aaa",
      fontSize: 14,
      marginBottom: 4,
   },

   actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 14,
   },

   editBtn: {
      backgroundColor: "#FF6D00",
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 8,
   },

   editText: {
      color: "#000",
      fontWeight: "bold",
      fontSize: 14,
   },

   deleteBtn: {
      backgroundColor: "#2a2a2a",
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ff4444",
   },

   deleteText: {
      color: "#ff4444",
      fontWeight: "bold",
      fontSize: 14,
   },

   emptyText: {
      color: "#777",
      textAlign: "center",
      marginTop: 50,
      fontSize: 15,
   },
});
