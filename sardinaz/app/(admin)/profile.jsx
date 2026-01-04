import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../store/authSlice"
import { useRouter } from "expo-router"

export default function AdminProfile() {
   const { user } = useSelector(state => state.auth)
   const dispatch = useDispatch()
   const router = useRouter()

   if (!user) return null

   const handleLogout = () => {
      dispatch(logout())
      router.replace("/(tabs)/login")
   }

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Admin Profile</Text>

         <View style={styles.card}>
            <ProfileRow label="Name" value={user.name || "Admin"} />
            <ProfileRow label="Email" value={user.email} />
            <ProfileRow label="Role" value={user.role} />
         </View>

         <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
         </TouchableOpacity>
      </View>
   )
}

function ProfileRow({ label, value }) {
   return (
      <View style={styles.row}>
         <Text style={styles.label}>{label}</Text>
         <Text style={styles.value}>{value}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#121212",
      padding: 20,
   },
   title: {
      color: "#FF6D00",
      fontSize: 22,
      marginBottom: 20,
      fontWeight: "bold",
   },
   card: {
      backgroundColor: "#1e1e1e",
      borderRadius: 12,
      padding: 16,
   },
   row: {
      marginBottom: 14,
   },
   label: {
      color: "#aaa",
      fontSize: 13,
   },
   value: {
      color: "#fff",
      fontSize: 16,
      marginTop: 2,
   },
   logoutBtn: {
      marginTop: 30,
      backgroundColor: "#FF6D00",
      padding: 14,
      borderRadius: 10,
   },
   logoutText: {
      color: "#000",
      fontWeight: "bold",
      textAlign: "center",
   },
})
