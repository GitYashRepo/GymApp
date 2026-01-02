"use client"

import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, TextInput } from "react-native"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPods } from "../../store/podSlice"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function PodsScreen() {
   const dispatch = useDispatch()
   const { list } = useSelector((state) => state.pods)

   useEffect(() => {
      dispatch(fetchPods())
   }, [])

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#FFD500" style={styles.searchIcon} />
            <TextInput placeholder="Search Pods..." placeholderTextColor="#999" style={styles.searchInput} />
         </View>

         <FlatList
            data={list}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
               <View style={styles.card}>
                  <View style={styles.imageContainer}>
                     <Image source={{ uri: item.images[0] }} style={styles.image} />
                     <TouchableOpacity style={styles.infoBtn}>
                        <MaterialCommunityIcons name="information" size={16} color="#FFD500" />
                     </TouchableOpacity>
                  </View>

                  <View style={styles.capacityBar}>
                     <View style={styles.capacityContent}>
                        <MaterialCommunityIcons name="account" size={16} color="#000" />
                        <Text style={styles.capacityText}>Maximum Capacity: {item.maxCapacity} pax</Text>
                     </View>
                     <TouchableOpacity>
                        <MaterialCommunityIcons name="heart-outline" size={20} color="#000" />
                     </TouchableOpacity>
                  </View>

                  <View style={styles.infoSection}>
                     <Text style={styles.locationName}>{item.locationName}</Text>
                     <Text style={styles.price}>Price: ${item.pricePer30Min}</Text>
                     <TouchableOpacity style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>BOOK</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            )}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
         />
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#1a1a1a",
   },
   searchContainer: {
      backgroundColor: "#333",
      marginHorizontal: 12,
      marginVertical: 12,
      borderRadius: 10,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
   },
   searchIcon: {
      marginRight: 8,
   },
   searchInput: {
      flex: 1,
      color: "#fff",
      paddingVertical: 12,
      fontSize: 14,
   },
   listContent: {
      paddingBottom: 80,
   },
   card: {
      backgroundColor: "#222",
      marginHorizontal: 12,
      marginVertical: 10,
      borderRadius: 12,
      overflow: "hidden",
   },
   imageContainer: {
      position: "relative",
      width: "100%",
      height: 180,
   },
   image: {
      width: "100%",
      height: "100%",
   },
   infoBtn: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#333",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#FFD500",
   },
   capacityBar: {
      backgroundColor: "#FFD500",
      paddingVertical: 10,
      paddingHorizontal: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   capacityContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
   },
   capacityText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#000",
   },
   infoSection: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: "#222",
   },
   locationName: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFD500",
      marginBottom: 6,
   },
   price: {
      fontSize: 14,
      color: "#FFD500",
      fontWeight: "600",
      marginBottom: 12,
   },
   bookBtn: {
      backgroundColor: "#FFD500",
      paddingVertical: 12,
      borderRadius: 20,
      alignItems: "center",
   },
   bookBtnText: {
      fontWeight: "700",
      color: "#000",
      fontSize: 14,
      letterSpacing: 1,
   },
})
