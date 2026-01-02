import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const MOCK_CONTENT = [
   {
      id: "1",
      title: "Workout Tips for Beginners",
      description: "Learn the basics of getting started with fitness",
      type: "Article",
      image: "https://via.placeholder.com/300x200?text=Workout+Tips",
   },
   {
      id: "2",
      title: "Nutrition Guide",
      description: "Complete guide to healthy eating",
      type: "Video",
      image: "https://via.placeholder.com/300x200?text=Nutrition",
   },
   {
      id: "3",
      title: "Recovery Techniques",
      description: "Best practices for post-workout recovery",
      type: "Article",
      image: "https://via.placeholder.com/300x200?text=Recovery",
   },
   {
      id: "4",
      title: "Cardio Workouts",
      description: "Effective cardio exercises for all levels",
      type: "Video",
      image: "https://via.placeholder.com/300x200?text=Cardio",
   },
]

export default function ContentScreen() {
   return (
      <SafeAreaView style={styles.container}>
         <FlatList
            data={MOCK_CONTENT}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <TouchableOpacity style={styles.contentCard} activeOpacity={0.7}>
                  <Image source={{ uri: item.image }} style={styles.contentImage} />
                  <View style={styles.contentOverlay}>
                     <MaterialCommunityIcons name="play-circle" size={48} color="#FF6D00" />
                  </View>
                  <View style={styles.contentInfo}>
                     <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
                     </View>
                     <Text style={styles.contentTitle}>{item.title}</Text>
                     <Text style={styles.contentDescription}>{item.description}</Text>
                  </View>
               </TouchableOpacity>
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
   contentCard: {
      backgroundColor: "#222",
      marginVertical: 10,
      borderRadius: 12,
      overflow: "hidden",
   },
   contentImage: {
      width: "100%",
      height: 180,
   },
   contentOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
   },
   contentInfo: {
      paddingHorizontal: 12,
      paddingVertical: 12,
   },
   typeBadge: {
      backgroundColor: "#FF6D00",
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 6,
   },
   typeText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#000",
      letterSpacing: 0.5,
   },
   contentTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FF6D00",
      marginBottom: 4,
   },
   contentDescription: {
      fontSize: 13,
      color: "#999",
      lineHeight: 18,
   },
})
