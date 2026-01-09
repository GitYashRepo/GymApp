import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   SafeAreaView,
   TouchableOpacity,
   Image,
   ActivityIndicator,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import { useRouter } from "expo-router"
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Modal } from "react-native"
import * as ImagePicker from "expo-image-picker"
import api from "../../services/api"
import { logout } from "../../store/authSlice"

export default function ProfileScreen() {
   const dispatch = useDispatch()
   const router = useRouter()
   const [bookingCount, setBookingCount] = useState(0)
   const [user, setUser] = useState(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState("")
   const [modalVisible, setModalVisible] = useState(false)
   const [uploading, setUploading] = useState(false)
   const [favoriteCount, setFavoriteCount] = useState(0);

   const { token } = useSelector((state) => state.auth);

   const fetchBookingCount = async () => {
      try {
         const res = await api.get("/bookings/my")
         setBookingCount(res.data.data.length)
      } catch {
         console.log("❌ Failed to fetch booking count")
      }
   }


   useFocusEffect(
      useCallback(() => {
         if (token) {
            fetchProfile();
            fetchFavoriteCount();
            fetchBookingCount()
         }
      }, [token])
   );




   const fetchProfile = async () => {
      try {
         const res = await api.get("/users/me")
         setUser(res.data)
      } catch (err) {
         setError("Failed to load profile")
      } finally {
         setLoading(false)
      }
   }

   const handleLogout = () => {
      dispatch(logout())
      router.replace("/login")
   }

   const pickImage = async () => {
      setModalVisible(false)

      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.7,
      })

      if (result.canceled) return

      const image = result.assets[0]

      const formData = new FormData()
      formData.append("image", {
         uri: image.uri,
         name: "profile.jpg",
         type: "image/jpeg",
      })

      try {
         setUploading(true)
         const res = await api.put("/users/profile-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
         })
         setUser({ ...user, profileImage: res.data.image })
      } catch {
         alert("Image upload failed")
      } finally {
         setUploading(false)
      }
   }

   const fetchFavoriteCount = async () => {
      try {
         const res = await api.get("/users/favorites");
         setFavoriteCount(res.data.data.length);
      } catch (err) {
         console.log("❌ Failed to fetch favorites count");
      }
   };


   if (loading) {
      return (
         <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color="#FF6D00" />
         </SafeAreaView>
      )
   }

   if (error || !user) {
      return (
         <SafeAreaView style={styles.container}>
            <Text style={styles.errorText}>{error || "No user data"}</Text>
         </SafeAreaView>
      )
   }

   const date = new Date(user.createdAt)
   const memberSince = `${date.getDate()} ${date.toLocaleString("en-GB", {
      month: "long",
   })} ${date.getFullYear()}`

   /* ------------------ MENU ROUTES ------------------ */

   const menuItems = [
      {
         icon: "calendar",
         label: "My Bookings",
         route: "/mybookings",
      },
      {
         icon: "heart",
         label: "Favorites",
         route: "/favorites",
      },
      {
         icon: "lock",
         label: "Privacy & Security",
         route: "/privacy",
      },
      {
         icon: "help-circle",
         label: "Help & Support",
         route: "/help",
      },
   ]

   return (
      <>
         {/* IMAGE PICKER MODAL */}
         <Modal
            transparent
            animationType="fade"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
         >
            <View style={styles.modalBackdrop}>
               <View style={styles.modalBox}>
                  <TouchableOpacity style={styles.modalBtn} onPress={pickImage}>
                     <Text style={styles.modalText}>Choose Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={[styles.modalBtn, styles.cancelBtn]}
                     onPress={() => setModalVisible(false)}
                  >
                     <Text style={styles.modalText}>Cancel</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>

         <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
               {/* PROFILE HEADER */}
               <View style={styles.profileHeader}>
                  <View style={{ position: "relative" }}>
                     <Image
                        source={{
                           uri: user.profileImage
                              ? user.profileImage
                              : `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=FF6D00&color=000`,
                        }}
                        style={styles.avatar}
                     />
                     <TouchableOpacity
                        style={styles.editIcon}
                        onPress={() => setModalVisible(true)}
                     >
                        <MaterialCommunityIcons name="camera" size={18} color="#000" />
                     </TouchableOpacity>

                     {uploading && (
                        <View style={styles.uploadOverlay}>
                           <ActivityIndicator color="#fff" />
                        </View>
                     )}
                  </View>

                  <Text style={styles.name}>
                     {user.firstname} {user.lastname}
                  </Text>
                  <Text style={styles.email}>{user.email}</Text>
                  <Text style={styles.memberSince}>
                     Member since — {memberSince}
                  </Text>
               </View>

               {/* STATS */}
               <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                     <MaterialCommunityIcons name="calendar-check" size={24} color="#FF6D00" />
                     <Text style={styles.statValue}>{bookingCount}</Text>
                     <Text style={styles.statLabel}>Bookings</Text>
                  </View>
                  <View style={styles.statItem}>
                     <MaterialCommunityIcons name="heart" size={24} color="#FF6D00" />
                     <Text style={styles.statValue}>{favoriteCount}</Text>
                     <Text style={styles.statLabel}>Favorites</Text>
                  </View>
                  {/* <View style={styles.statItem}>
                     <MaterialCommunityIcons name="dumbbell" size={24} color="#FF6D00" />
                     <Text style={styles.statValue}>27</Text>
                     <Text style={styles.statLabel}>Sessions</Text>
                  </View> */}
               </View>

               {/* MENU */}
               <View style={styles.menuSection}>
                  {menuItems.map((item, index) => (
                     <TouchableOpacity
                        key={index}
                        style={styles.menuOption}
                        onPress={() => router.push(item.route)}
                     >
                        <MaterialCommunityIcons
                           name={item.icon}
                           size={20}
                           color="#FF6D00"
                        />
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <MaterialCommunityIcons
                           name="chevron-right"
                           size={20}
                           color="#666"
                        />
                     </TouchableOpacity>
                  ))}
               </View>

               {/* LOGOUT */}
               <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                  <MaterialCommunityIcons name="logout" size={20} color="#fff" />
                  <Text style={styles.logoutBtnText}>LOGOUT</Text>
               </TouchableOpacity>
            </ScrollView>
         </SafeAreaView>
      </>
   )
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#1a1a1a",
   },
   content: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      paddingBottom: 80,
   },
   profileHeader: {
      alignItems: "center",
      marginBottom: 24,
   },
   avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 12,
      borderWidth: 3,
      borderColor: "#FF6D00",
   },
   name: {
      fontSize: 22,
      fontWeight: "700",
      color: "#FF6D00",
   },
   email: {
      fontSize: 14,
      color: "#999",
   },
   memberSince: {
      fontSize: 12,
      color: "#666",
   },
   statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: "#222",
      borderRadius: 12,
      paddingVertical: 16,
      marginBottom: 24,
   },
   statItem: { alignItems: "center" },
   statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FF6D00",
   },
   statLabel: { fontSize: 12, color: "#999" },
   menuSection: { marginBottom: 24 },
   menuOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 12,
      backgroundColor: "#222",
      borderRadius: 10,
      marginBottom: 8,
   },
   menuLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      color: "#fff",
      marginLeft: 12,
   },
   logoutBtn: {
      backgroundColor: "#ff3b30",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 14,
      borderRadius: 10,
      marginBottom: 40,
   },
   logoutBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      marginLeft: 8,
   },
   errorText: {
      color: "red",
      textAlign: "center",
      marginTop: 40,
   },
   editIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#FF6D00",
      padding: 6,
      borderRadius: 20,
   },
   uploadOverlay: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
   },
   modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
   },
   modalBox: {
      width: "80%",
      backgroundColor: "#222",
      borderRadius: 12,
      padding: 20,
   },
   modalBtn: { paddingVertical: 14 },
   cancelBtn: {
      borderTopWidth: 1,
      borderTopColor: "#333",
      marginTop: 10,
   },
   modalText: {
      color: "#FF6D00",
      fontSize: 16,
      textAlign: "center",
   },
})
