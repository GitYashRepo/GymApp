import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
   View,
   Text,
   FlatList,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   Pressable,
   Image,
   SafeAreaView,
   ActivityIndicator,
   Alert,
   Modal,
   Linking,
} from "react-native";
import { Heart } from "lucide-react-native";
import { useTranslate } from "../../localization/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomePods } from "../../store/podSlice";
import api from "../../services/api";

const PLACEHOLDER_IMAGE = {
   uri: "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg",
};

/* -------------------- POD CARD -------------------- */
const PodCard = ({
   pod,
   isFavorite,
   onToggleFavorite,
   onBookPress,
   onSubscriptionPress,
   isBooking,
}) => {
   const t = useTranslate();

   const imageSource =
      pod.images && pod.images.length > 0
         ? { uri: pod.images[0] }
         : PLACEHOLDER_IMAGE;

   return (
      <View style={styles.card}>
         <Image source={imageSource} style={styles.podImage} />

         <View style={styles.capacityBar}>
            <Text style={styles.capacityText}>
               {t("bookingCard.max_capacity")}: {pod.maxCapacity || 1} pax
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
            <Text style={styles.locationName}>{pod.name}</Text>

            <Text style={styles.addressText}>
               📍 {pod.locationName || "Location not available"}
            </Text>

            <Text style={styles.priceText}>
               Price: <Text style={styles.priceAmount}>HK${pod.pricePer30Min}</Text>
               <Text style={styles.priceUnit}> /30 min</Text>
            </Text>

            {/* BOOK NOW + MONTHLY */}
            <View style={styles.buttonRow}>
               <TouchableOpacity
                  style={[styles.bookButton, isBooking && { opacity: 0.7 }]}
                  onPress={onBookPress}
                  disabled={isBooking}
               >
                  {isBooking ? (
                     <ActivityIndicator size="small" color="#000" />
                  ) : (
                     <Text style={styles.bookButtonText}>
                        {t("common.book_now")}
                     </Text>
                  )}
               </TouchableOpacity>

               <TouchableOpacity
                  style={styles.subscriptionMiniButton}
                  onPress={() => onSubscriptionPress("weekly")}
               >
                  <Text style={styles.subscriptionMiniButtonText}>
                     {t("bookingCard.weeklysubscription")}
                  </Text>
               </TouchableOpacity>

               <TouchableOpacity
                  style={styles.subscriptionMiniButton}
                  onPress={() => onSubscriptionPress("monthly")}
               >
                  <Text style={styles.subscriptionMiniButtonText}>
                     {t("bookingCard.monthlysubscription")}
                  </Text>
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
};

const SUBSCRIPTION_PAYLINKS = {
   monthly: {
      link: "https://www.sardinazgym.com/_paylink/AZu33yDG",
      amount: 349,
      label: "Monthly Subscription",
   },
   weekly: {
      link: "https://www.sardinazgym.com/_paylink/AZu33jNt",
      amount: 112,
      label: "Weekly Subscription",
   },
};


/* -------------------- HOME SCREEN -------------------- */
export default function HomeScreen() {
   const router = useRouter();
   const dispatch = useDispatch();
   const { pods, loading } = useSelector((state) => state.pods);
   const { token } = useSelector((state) => state.auth);
   const [subscriptionType, setSubscriptionType] = useState(null); // "monthly" | "weekly"
   const [hasPaid, setHasPaid] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [favorites, setFavorites] = useState(new Set());
   const [updating, setUpdating] = useState(false);
   const [bookingPodId, setBookingPodId] = useState(null);
   const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
   const [selectedPod, setSelectedPod] = useState(null);

   const t = useTranslate();

   useEffect(() => {
      dispatch(fetchHomePods());
   }, []);

   useFocusEffect(
      useCallback(() => {
         if (token) fetchFavorites();
      }, [token])
   );

   useFocusEffect(
      useCallback(() => {
         // when Home screen is focused again
         setBookingPodId(null);
      }, [])
   );


   const handleBookPress = (podId) => {
      if (!token) {
         Alert.alert("Login Required", "Login First !!", [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => router.push("/login") },
         ]);
         return;
      }

      setBookingPodId(podId);
      requestAnimationFrame(() => {
         router.push(`/booking/${podId}`);
      });
   };

   const fetchFavorites = async () => {
      try {
         const res = await api.get("/users/favorites");
         const ids = res.data.data.map((pod) => pod._id);
         setFavorites(new Set(ids));
      } catch (err) {
         console.log("❌ Fetch favorites error", err);
      }
   };

   const toggleFavorite = async (podId) => {
      if (updating) return;
      setUpdating(true);

      const isFav = favorites.has(podId);

      try {
         if (isFav) {
            await api.delete(`/users/favorites/${podId}`);
         } else {
            await api.post(`/users/favorites/${podId}`);
         }

         setFavorites((prev) => {
            const next = new Set(prev);
            isFav ? next.delete(podId) : next.add(podId);
            return next;
         });
      } catch (err) {
         console.log("❌ Favorite error:", err.message);
      } finally {
         setUpdating(false);
      }
   };

   const handleSharePayment = () => {
      const message = "Dear Sardinaz Gym, here is the payment screenshot.";
      const url = `https://wa.me/85293605397?text=${encodeURIComponent(message)}`;

      Linking.openURL(url).catch(() =>
         Alert.alert("Error", "WhatsApp is not installed")
      );

      setShowConfirm(true);
   };


   const filteredPods = pods.filter((pod) =>
      (pod.locationName || pod.name || "")
         .toLowerCase()
         .includes(searchQuery.toLowerCase())
   );

   const handlePayNow = async () => {
      const config = SUBSCRIPTION_PAYLINKS[subscriptionType];
      if (!config) return;

      try {
         setHasPaid(true);
         await Linking.openURL(config.link);
      } catch {
         Alert.alert("Error", "Unable to open payment page");
      }
   };

   const handleConfirmSubscription = () => {
      const config = SUBSCRIPTION_PAYLINKS[subscriptionType];

      Alert.alert(
         "Booking Successful ✅",
         `Your ${config.label} has been confirmed.\nAmount Paid: HKD ${config.amount}`
      );

      setSubscriptionModalVisible(false);
      setSubscriptionType(null);
      setHasPaid(false);
      setShowConfirm(false);
   };



   return (
      <SafeAreaView style={styles.container}>
         {/* SEARCH */}
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
               contentContainerStyle={styles.listContainer}
               renderItem={({ item }) => (
                  <PodCard
                     pod={item}
                     isFavorite={favorites.has(item._id)}
                     onToggleFavorite={toggleFavorite}
                     onBookPress={() => handleBookPress(item._id)}
                     onSubscriptionPress={(type) => {
                        setSubscriptionType(type);
                        setHasPaid(false);
                        setShowConfirm(false);
                        setSubscriptionModalVisible(true);
                     }}
                     isBooking={bookingPodId === item._id}
                  />
               )}
            />
         )}

         {/* MODAL */}
         <Modal transparent animationType="fade" visible={subscriptionModalVisible}>
            <View style={styles.modalOverlay}>
               <View style={styles.modalContainer}>

                  <Text style={styles.modalTitle}>
                     {t(`bookingCard.${subscriptionType}subscription`)} - HK${SUBSCRIPTION_PAYLINKS[subscriptionType]?.amount}
                  </Text>

                  <Text style={styles.modalSubText}>
                     {t("bookingCard.tocompletepaymenttext")}
                  </Text>


                  <Text style={styles.modalHighlight}>
                     {t("bookingCard.pleasetakescreenshottext")}
                  </Text>

                  <Pressable style={styles.modalBookButton} onPress={handlePayNow}>
                     <Text style={styles.modalBookButtonText}>{t("bookingCard.paynowbtn")}</Text>
                  </Pressable>

                  {hasPaid && (
                     <Pressable
                        style={styles.whatsappBtn}
                        onPress={handleSharePayment}
                     >
                        <Text style={styles.whatsappText}>
                           {t("bookingCard.sharepaymentscreenshot")}
                        </Text>
                     </Pressable>
                  )}

                  {showConfirm && (
                     <Pressable
                        style={styles.confirmBtn}
                        onPress={handleConfirmSubscription}
                     >
                        <Text style={styles.confirmText}>{t("bookingCard.confirmbtn")}</Text>
                     </Pressable>
                  )}

                  <TouchableOpacity
                     onPress={() => setSubscriptionModalVisible(false)}
                  >
                     <Text style={styles.modalCloseText}>{t("bookingCard.cancel")}</Text>
                  </TouchableOpacity>

               </View>
            </View>
         </Modal>

      </SafeAreaView>
   );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#1a1a1a" },
   searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",        // ✅ vertical centering
      backgroundColor: "#333",
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 8,
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 48,                  // ✅ consistent height
   },
   searchIcon: { marginRight: 8 },
   searchInput: { flex: 1, color: "#fff" },

   listContainer: { padding: 16 },

   card: { backgroundColor: "#2a2a2a", borderRadius: 12, marginBottom: 16 },
   podImage: { width: "100%", height: 200 },
   capacityBar: {
      backgroundColor: "#FF6D00",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
   },
   capacityText: { fontWeight: "bold" },

   detailsContainer: { padding: 16 },
   locationName: { color: "#FF6D00", fontSize: 18, fontWeight: "bold" },
   addressText: { color: "#aaa", marginVertical: 6 },
   priceText: { color: "#FF6D00", fontWeight: "bold" },

   buttonRow: { flexDirection: "row", gap: 10, marginTop: 12 },

   bookButton: {
      flex: 1,
      backgroundColor: "#FF6D00",
      paddingVertical: 12,
      borderRadius: 20,
      alignItems: "center",
   },
   bookButtonText: { fontWeight: "bold", color: "#000" },

   subscriptionMiniButton: {
      backgroundColor: "#333",
      borderWidth: 1,
      borderColor: "#FF6D00",
      borderRadius: 20,
      paddingHorizontal: 16,
      justifyContent: "center",
   },
   subscriptionMiniButtonText: {
      color: "#FF6D00",
      fontWeight: "bold",
      fontSize: 12,
   },

   modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
   },
   modalContainer: {
      backgroundColor: "#2a2a2a",
      padding: 24,
      borderRadius: 12,
      width: "85%",
      alignItems: "center",
   },
   modalTitle: {
      color: "#FF6D00",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
   },
   modalSubText: { color: "#aaa", marginVertical: 10, textAlign: "center" },
   modalBookButton: {
      backgroundColor: "#FF6D00",
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginBottom: 10,
   },
   modalBookButtonText: { color: "#000", fontWeight: "bold" },
   modalCloseText: { color: "#aaa" },
   modalHighlight: {
      color: "#FF6D00",
      fontWeight: "700",
      textAlign: "center",
      marginVertical: 12,
   },

   whatsappBtn: {
      backgroundColor: "#25D366",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginBottom: 10,
   },

   whatsappText: {
      color: "#000",
      fontWeight: "700",
   },

   confirmBtn: {
      backgroundColor: "#000",
      borderWidth: 1,
      borderColor: "#FF6D00",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginBottom: 10,
   },

   confirmText: {
      color: "#FF6D00",
      fontWeight: "700",
   },
});
