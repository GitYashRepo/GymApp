import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const MOCK_CLASSES = [
   {
      id: "1",
      name: "HIIT Training",
      instructor: "John Doe",
      time: "10:00 AM",
      duration: "45 min",
      capacity: "3 pax",
      image: "https://via.placeholder.com/300x200?text=HIIT+Training",
   },
   {
      id: "2",
      name: "Yoga Flow",
      instructor: "Jane Smith",
      time: "2:00 PM",
      duration: "60 min",
      capacity: "3 pax",
      image: "https://via.placeholder.com/300x200?text=Yoga+Flow",
   },
   {
      id: "3",
      name: "Strength Training",
      instructor: "Mike Johnson",
      time: "4:00 PM",
      duration: "50 min",
      capacity: "3 pax",
      image: "https://via.placeholder.com/300x200?text=Strength",
   },
]

export default function ClassesScreen() {
   return (
      <SafeAreaView style={styles.container}>
         <FlatList
            data={MOCK_CLASSES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <View style={styles.classCard}>
                  <Image source={{ uri: item.image }} style={styles.classImage} />
                  <View style={styles.classInfo}>
                     <Text style={styles.className}>{item.name}</Text>
                     <Text style={styles.instructor}>Instructor: {item.instructor}</Text>
                     <View style={styles.detailsRow}>
                        <MaterialCommunityIcons name="clock" size={16} color="#FF6D00" />
                        <Text style={styles.detail}>{item.time}</Text>
                     </View>
                     <View style={styles.detailsRow}>
                        <MaterialCommunityIcons name="timer" size={16} color="#FF6D00" />
                        <Text style={styles.detail}>{item.duration}</Text>
                     </View>
                     <View style={styles.detailsRow}>
                        <MaterialCommunityIcons name="account-multiple" size={16} color="#FF6D00" />
                        <Text style={styles.detail}>{item.capacity}</Text>
                     </View>
                     <TouchableOpacity style={styles.enrollBtn}>
                        <Text style={styles.enrollBtnText}>ENROLL NOW</Text>
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
   listContent: {
      paddingBottom: 80,
      paddingHorizontal: 12,
   },
   classCard: {
      backgroundColor: "#222",
      marginVertical: 10,
      borderRadius: 12,
      overflow: "hidden",
   },
   classImage: {
      width: "100%",
      height: 150,
   },
   classInfo: {
      paddingHorizontal: 12,
      paddingVertical: 12,
   },
   className: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FF6D00",
      marginBottom: 6,
   },
   instructor: {
      fontSize: 13,
      color: "#999",
      marginBottom: 10,
   },
   detailsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
   },
   detail: {
      fontSize: 13,
      color: "#fff",
      marginLeft: 8,
   },
   enrollBtn: {
      backgroundColor: "#FF6D00",
      paddingVertical: 12,
      borderRadius: 20,
      alignItems: "center",
      marginTop: 12,
   },
   enrollBtnText: {
      fontWeight: "700",
      color: "#000",
      fontSize: 14,
      letterSpacing: 1,
   },
})


// Not in Use Corrently !
