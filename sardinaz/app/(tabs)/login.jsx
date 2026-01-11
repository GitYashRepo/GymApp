import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { loginUser, loginAdmin } from "../../store/authSlice"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"


export default function LoginScreen() {
   const dispatch = useDispatch()
   const router = useRouter()
   const { user, loading, error } = useSelector(state => state.auth)

   const [isAdmin, setIsAdmin] = useState(false)
   const [form, setForm] = useState({ email: "", password: "" })
   const [showPassword, setShowPassword] = useState(false)



   useEffect(() => {
      if (!user) return

      if (user.role === "admin") {
         router.replace("/(admin)/profile")
      } else {
         router.replace("/(tabs)/")
      }
   }, [user])


   const handleLogin = () => {
      if (isAdmin) dispatch(loginAdmin(form))
      else dispatch(loginUser(form))
   }

   return (
      <View style={styles.container}>
         <Text style={styles.title}>
            {isAdmin ? "Admin Login" : "User Login"}
         </Text>

         <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            style={styles.input}
            onChangeText={v => setForm({ ...form, email: v })}
         />
         <View style={styles.passwordContainer}>
            <TextInput
               placeholder="Password"
               placeholderTextColor="#777"
               secureTextEntry={!showPassword}
               style={styles.passwordInput}
               onChangeText={v => setForm({ ...form, password: v })}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
               <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#999"
               />
            </TouchableOpacity>
         </View>


         {error && <Text style={styles.error}>{error}</Text>}

         <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)}>
            <Text style={styles.switch}>
               {isAdmin ? "Login as User" : "Login as Admin"}
            </Text>
         </TouchableOpacity>

         {!isAdmin && (
            <TouchableOpacity onPress={() => router.push("/(tabs)/register")}>
               <Text style={styles.register}>Create Account</Text>
            </TouchableOpacity>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#121212", padding: 20, justifyContent: "center" },
   title: { color: "#FF6D00", fontSize: 22, textAlign: "center", marginBottom: 20 },
   input: { backgroundColor: "#2a2a2a", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 },
   button: { backgroundColor: "#FF6D00", padding: 15, borderRadius: 10 },
   buttonText: { color: "#000", textAlign: "center", fontWeight: "bold" },
   switch: { color: "#aaa", fontSize: 22, textAlign: "center", marginTop: 15, marginTop: 30 },
   register: { color: "#FF6D00", fontSize: 22, textAlign: "center", marginTop: 10 },
   error: { color: "red", textAlign: "center", marginBottom: 10 },
   passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#2a2a2a",
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 12,
   },
   passwordInput: {
      flex: 1,
      color: "#fff",
      paddingVertical: 12,
   },

})
