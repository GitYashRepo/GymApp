import { useState } from "react"
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView } from "react-native"
import { Heart, Info } from "lucide-react-native"


const DUMMY_PODS = [
   {
      id: "1",
      locationName: "Tampines Sun Plaza Park",
      pricePer30Min: 9.75,
      image: "https://images.unsplash.com/photo-1631217315655-ae51a0cf0c51?w=500&h=300&fit=crop",
      capacity: 3,
      address: "123 Tampines Ave 1, Singapore 528622",
   },
   {
      id: "2",
      locationName: "Bedok Fitness Hub",
      pricePer30Min: 12.5,
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500&h=300&fit=crop",
      capacity: 4,
      address: "456 Bedok Ave 2, Singapore 460456",
   },
   {
      id: "3",
      locationName: "Downtown Business District",
      pricePer30Min: 15.0,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=300&fit=crop",
      capacity: 3,
      address: "789 Market Street, Singapore 048940",
   },
   {
      id: "4",
      locationName: "Marina Bay Wellness Center",
      pricePer30Min: 18.5,
      image: "https://images.unsplash.com/photo-1585399363661-e896f3d57eae?w=500&h=300&fit=crop",
      capacity: 5,
      address: "321 Marina Boulevard, Singapore 018989",
   },
   {
      id: "5",
      locationName: "Orchard Road Premium Pod",
      pricePer30Min: 20.0,
      image: "https://images.unsplash.com/photo-1593080494218-0c3abb6c7e4d?w=500&h=300&fit=crop",
      capacity: 3,
      address: "555 Orchard Road, Singapore 238801",
   },
]

const PodCard = ({ pod, isFavorite, onToggleFavorite }) => {
   return (
      <View style={styles.card}>
         {/* Pod Image */}
         <Image source={{ uri: pod.image }} style={styles.podImage} />

         {/* Info Button */}
         <TouchableOpacity style={styles.infoButton}>
            <Info size={20} color="#000" />
         </TouchableOpacity>

         {/* Capacity Bar */}
         <View style={styles.capacityBar}>
            <Text style={styles.capacityText}>Maximum Capacity: {pod.capacity} pax</Text>
            <TouchableOpacity onPress={() => onToggleFavorite(pod.id)}>
               <Heart size={24} color="#000" fill={isFavorite ? "#000" : "transparent"} />
            </TouchableOpacity>
         </View>

         {/* Pod Details */}
         <View style={styles.detailsContainer}>
            <Text style={styles.locationName}>{pod.locationName}</Text>

            <View style={styles.addressRow}>
               <Text style={styles.addressIcon}>📍</Text>
               <Text style={styles.addressText}>{pod.address}</Text>
            </View>

            <Text style={styles.priceText}>
               Price: <Text style={styles.priceAmount}>${pod.pricePer30Min}</Text>
               <Text style={styles.priceUnit}>/30 min</Text>
            </Text>

            <Text style={styles.disclaimer}>Check out our business profiles on Google and social media</Text>

            <TouchableOpacity style={styles.bookButton}>
               <Text style={styles.bookButtonText}>BOOK NOW</Text>
            </TouchableOpacity>
         </View>
      </View>
   )
}

export default function HomeScreen() {
   const [searchQuery, setSearchQuery] = useState("")
   const [favorites, setFavorites] = useState(new Set())

   const filteredPods = DUMMY_PODS.filter((pod) => pod.locationName.toLowerCase().includes(searchQuery.toLowerCase()))

   const toggleFavorite = (id) => {
      const newFavorites = new Set(favorites)
      if (newFavorites.has(id)) {
         newFavorites.delete(id)
      } else {
         newFavorites.add(id)
      }
      setFavorites(newFavorites)
   }

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         {/* <View style={styles.header}>
            <View style={styles.headerTop}>
               <TouchableOpacity>
                  <Text style={styles.menuIcon}>☰</Text>
               </TouchableOpacity>
               <Text style={styles.headerTitle}>The Gym Pod</Text>
               <TouchableOpacity>
                  <Text style={styles.filterIcon}>⋮</Text>
               </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
               <Text style={styles.searchIcon}>🔍</Text>
               <TextInput
                  style={styles.searchInput}
                  placeholder="Search Pod here..."
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
               />
            </View>
         </View> */}

         {/* Search Bar */}
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

         {/* Pod List */}
         <FlatList
            data={filteredPods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <PodCard pod={item} isFavorite={favorites.has(item.id)} onToggleFavorite={toggleFavorite} />
            )}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={true}
            ListEmptyComponent={
               <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No pods found matching your search.</Text>
               </View>
            }
         />
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#1a1a1a",
      paddingBottom: 80
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
   infoButton: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#333",
      borderWidth: 2,
      borderColor: "#FFD700",
      justifyContent: "center",
      alignItems: "center",
   },
   capacityBar: {
      backgroundColor: "#FFD700",
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
      color: "#FFD700",
      marginBottom: 8,
   },
   addressRow: {
      flexDirection: "row",
      marginBottom: 12,
   },
   addressIcon: {
      fontSize: 14,
      marginRight: 8,
   },
   addressText: {
      fontSize: 12,
      color: "#aaa",
      flex: 1,
   },
   priceText: {
      fontSize: 14,
      color: "#FFD700",
      fontWeight: "bold",
      marginBottom: 8,
   },
   priceAmount: {
      fontSize: 16,
   },
   priceUnit: {
      fontSize: 12,
      marginLeft: 4,
   },
   disclaimer: {
      fontSize: 12,
      color: "#666",
      marginBottom: 12,
   },
   bookButton: {
      backgroundColor: "#FFD700",
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
})
