import { useEffect, useState } from "react";
import {
   View,
   Text,
   FlatList,
   StyleSheet,
   SafeAreaView,
   Image,
   ActivityIndicator,
   TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../../services/api";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";


const POD_IMAGE = require("../../assets/images/pod-1.png");
const PUPPY_IMAGE = {
   uri: "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"
};

export default function FavoritesScreen() {
   const [favorites, setFavorites] = useState([]);
   const [loading, setLoading] = useState(true);


   useFocusEffect(
      useCallback(() => {
         fetchFavorites();
      }, [])
   );


   const fetchFavorites = async () => {
      try {
         const res = await api.get("/users/favorites");
         setFavorites(res.data.data || []);
      } catch (err) {
         console.log("❌ Fetch favorites error", err);
      } finally {
         setLoading(false);
      }
   };

   const removeFavorite = async (podId) => {
      try {
         await api.delete(`/users/favorites/${podId}`);

         // Optimistic UI update
         setFavorites((prev) => prev.filter((pod) => pod._id !== podId));
      } catch (err) {
         console.log("❌ Remove favorite error", err);
      }
   };

   if (loading) {
      return (
         <SafeAreaView style={styles.center}>
            <ActivityIndicator size="large" color="#FF6D00" />
         </SafeAreaView>
      );
   }

   if (!favorites.length) {
      return (
         <SafeAreaView style={styles.center}>
            <Text style={styles.emptyTitle}>No Favorites Yet ❤️</Text>
            <Text style={styles.emptyText}>
               Tap the heart icon on a pod to save it here.
            </Text>
         </SafeAreaView>
      );
   }

   return (
      <SafeAreaView style={styles.container}>
         <FlatList
            data={favorites}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
               const isSuiHong = item.locationName === "Sui Hong, Hong Kong";
               const imageSource = isSuiHong ? POD_IMAGE : PUPPY_IMAGE;
               return (
                  <View style={styles.card}>
                     <Image source={imageSource} style={styles.image} />

                     <View style={styles.info}>
                        <View style={styles.row}>
                           <Text style={styles.name}>{item.name}</Text>

                           <TouchableOpacity
                              onPress={() => removeFavorite(item._id)}
                           >
                              <MaterialCommunityIcons
                                 name="heart-broken"
                                 size={22}
                                 color="#ff3b30"
                              />
                           </TouchableOpacity>
                        </View>

                        <Text style={styles.location}>
                           📍 {item.locationName}
                        </Text>

                        <Text style={styles.price}>
                           HK$ {item.pricePer30Min}
                           <Text style={styles.unit}> /30 min</Text>
                        </Text>
                     </View>
                  </View>
               )
            }}
         />
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#1a1a1a",
      marginBottom: 80,
   },
   list: {
      padding: 16,
      gap: 16,
   },
   card: {
      backgroundColor: "#2a2a2a",
      borderRadius: 14,
      overflow: "hidden",
      elevation: 4,
   },
   image: {
      width: "100%",
      height: 160,
      backgroundColor: "#333",
   },
   info: {
      padding: 16,
   },
   row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   name: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FF6D00",
   },
   location: {
      fontSize: 13,
      color: "#aaa",
      marginTop: 6,
      marginBottom: 10,
   },
   price: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FF6D00",
   },
   unit: {
      fontSize: 12,
      color: "#aaa",
   },
   center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1a1a1a",
      padding: 24,
   },
   emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FF6D00",
      marginBottom: 8,
   },
   emptyText: {
      fontSize: 14,
      color: "#888",
      textAlign: "center",
      lineHeight: 20,
   },
});
