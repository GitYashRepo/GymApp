import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import api from "../../services/api"
import { useRouter } from "expo-router"
import { useState } from "react"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function Register() {
   const router = useRouter()

   const [showPassword, setShowPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
   const [error, setError] = useState("")

   const [form, setForm] = useState({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
   })

   const handleRegister = async () => {
      if (form.password !== form.confirmPassword) {
         setError("Passwords do not match")
         return
      }

      setError("")

      await api.post("/users/register", {
         firstname: form.firstname,
         lastname: form.lastname,
         email: form.email,
         phone: form.phone,
         password: form.password,
      })

      router.replace("/(tabs)/login")
   }

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Register</Text>

         <TextInput
            placeholder="firstname"
            placeholderTextColor="#777"
            style={styles.input}
            onChangeText={(v) => setForm({ ...form, firstname: v })}
         />

         <TextInput
            placeholder="lastname"
            placeholderTextColor="#777"
            style={styles.input}
            onChangeText={(v) => setForm({ ...form, lastname: v })}
         />

         <TextInput
            placeholder="email"
            placeholderTextColor="#777"
            style={styles.input}
            onChangeText={(v) => setForm({ ...form, email: v })}
         />

         <TextInput
            placeholder="phone"
            placeholderTextColor="#777"
            style={styles.input}
            onChangeText={(v) => setForm({ ...form, phone: v })}
         />

         {/* Password */}
         <View style={styles.passwordContainer}>
            <TextInput
               placeholder="password"
               placeholderTextColor="#777"
               secureTextEntry={!showPassword}
               style={styles.passwordInput}
               onChangeText={(v) => setForm({ ...form, password: v })}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
               <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#999"
               />
            </TouchableOpacity>
         </View>

         {/* Confirm Password */}
         <View style={styles.passwordContainer}>
            <TextInput
               placeholder="confirm password"
               placeholderTextColor="#777"
               secureTextEntry={!showConfirmPassword}
               style={styles.passwordInput}
               onChangeText={(v) =>
                  setForm({ ...form, confirmPassword: v })
               }
            />
            <TouchableOpacity
               onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
               <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#999"
               />
            </TouchableOpacity>
         </View>

         {error ? <Text style={styles.error}>{error}</Text> : null}

         <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => router.push("/(tabs)/login")}>
            <Text style={styles.register}>Login as User</Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#121212",
      padding: 20,
      justifyContent: "center",
   },
   title: {
      color: "#FF6D00",
      fontSize: 22,
      textAlign: "center",
      marginBottom: 20,
   },
   input: {
      backgroundColor: "#2a2a2a",
      color: "#fff",
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
   },
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
   button: {
      backgroundColor: "#FF6D00",
      padding: 15,
      borderRadius: 10,
      marginTop: 5,
   },
   buttonText: {
      color: "#000",
      textAlign: "center",
      fontWeight: "bold",
   },
   register: {
      color: "#FF6D00",
      fontSize: 22,
      textAlign: "center",
      marginTop: 30,
   },
   error: {
      color: "red",
      textAlign: "center",
      marginBottom: 10,
   },
})
