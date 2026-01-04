import { useState, useEffect } from "react";
import {
   View,
   Text,
   FlatList,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   Image,
   SafeAreaView,
   ActivityIndicator,
} from "react-native";
import { Heart } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTranslate } from "../../localization/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomePods } from "../../store/podSlice";

const POD_IMAGE = require("../../assets/images/pod-1.png");

const PodCard = ({ pod, isFavorite, onToggleFavorite, onBookPress }) => {
   const t = useTranslate();

   return (
      <View style={styles.card}>
         <Image source={POD_IMAGE} style={styles.podImage} />

         <View style={styles.capacityBar}>
            <Text style={styles.capacityText}>
               Maximum Capacity: {pod.capacity || 1} pax
            </Text>
            <TouchableOpacity onPress={() => onToggleFavorite(pod._id)}>
               <Heart
                  size={24}
                  color="#000"
                  fill={isFavorite ? "#000" : "transparent"}
               />
            </TouchableOpacity>
         </View>

         <View style={styles.detailsContainer}>
            <Text style={styles.locationName}>
               {pod.locationName || pod.name}
            </Text>

            <Text style={styles.addressText}>
               📍 {pod.locationName || "Location not available"}
            </Text>

            <Text style={styles.priceText}>
               Price: <Text style={styles.priceAmount}>${pod.pricePer30Min}</Text>
               <Text style={styles.priceUnit}> /30 min</Text>
            </Text>

            <TouchableOpacity style={styles.bookButton} onPress={onBookPress}>
               <Text style={styles.bookButtonText}>
                  {t("common.book_now")}
               </Text>
            </TouchableOpacity>
         </View>
      </View>
   );
};

export default function HomeScreen() {
   const router = useRouter();
   const dispatch = useDispatch();

   const { pods, loading } = useSelector((state) => state.pods);

   const [searchQuery, setSearchQuery] = useState("");
   const [favorites, setFavorites] = useState(new Set());

   useEffect(() => {
      dispatch(fetchHomePods());
   }, []);

   useEffect(() => {
      console.log("✅ REDUX PODS:", pods);
   }, [pods]);

   const filteredPods = pods.filter((pod) =>
      (pod.locationName || pod.name || "")
         .toLowerCase()
         .includes(searchQuery.toLowerCase())
   );

   const toggleFavorite = (id) => {
      const next = new Set(favorites);
      next.has(id) ? next.delete(id) : next.add(id);
      setFavorites(next);
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.searchBarContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
               style={styles.searchInput}
               placeholder="Search Pod here..."
               placeholderTextColor="#999"
               value={searchQuery}
               onChangeText={setSearchQuery}
            />
         </View>

         {loading ? (
            <ActivityIndicator size="large" color="#FF6D00" />
         ) : (
            <FlatList
               data={filteredPods}
               keyExtractor={(item) => item._id}
               renderItem={({ item }) => (
                  <PodCard
                     pod={item}
                     isFavorite={favorites.has(item._id)}
                     onToggleFavorite={toggleFavorite}
                     onBookPress={() => router.push(`/booking/${item._id}`)}
                  />
               )}
               contentContainerStyle={styles.listContainer}
               ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                     <Text style={styles.emptyText}>No pods found.</Text>
                  </View>
               }
            />
         )}
      </SafeAreaView>
   );
}


const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#1a1a1a",
      paddingBottom: 80,
   },
   searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#333",
      borderRadius: 8,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginVertical: 12,
   },
   searchIcon: {
      fontSize: 16,
      marginRight: 8,
   },
   searchInput: {
      flex: 1,
      paddingVertical: 10,
      color: "#fff",
      fontSize: 14,
   },
   listContainer: {
      padding: 16,
      gap: 16,
   },
   card: {
      backgroundColor: "#2a2a2a",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 8,
   },
   podImage: {
      width: "100%",
      height: 200,
      backgroundColor: "#404040",
   },
   capacityBar: {
      backgroundColor: "#FF6D00",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
   },
   capacityText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#000",
   },
   detailsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
   },
   locationName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FF6D00",
      marginBottom: 8,
   },
   addressText: {
      fontSize: 12,
      color: "#aaa",
      marginBottom: 12,
   },
   priceText: {
      fontSize: 14,
      color: "#FF6D00",
      fontWeight: "bold",
      marginBottom: 8,
   },
   priceAmount: {
      fontSize: 16,
   },
   priceUnit: {
      fontSize: 12,
   },
   bookButton: {
      backgroundColor: "#FF6D00",
      paddingVertical: 12,
      borderRadius: 20,
      alignItems: "center",
   },
   bookButtonText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#000",
   },
   emptyContainer: {
      paddingVertical: 40,
      alignItems: "center",
   },
   emptyText: {
      fontSize: 16,
      color: "#666",
   },
});
