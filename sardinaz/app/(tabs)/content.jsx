import React, { useState, useCallback, useEffect } from "react"
import {
   View,
   Text,
   StyleSheet,
   SafeAreaView,
   FlatList,
   TouchableOpacity,
   Image,
   Modal,
   Dimensions,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import YoutubePlayer from "react-native-youtube-iframe"
import * as ScreenOrientation from "expo-screen-orientation"

const { width } = Dimensions.get("window")

/* ------------------ YOUTUBE ID EXTRACTOR ------------------ */
const getYouTubeId = (url) => {
   const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&/]{11})/
   const match = url.match(regExp)
   return match ? match[1] : null
}

/* ------------------ VIDEO DATA (TITLE + DESCRIPTION) ------------------ */
const VIDEOS = [
   {
      id: "1",
      url: "https://youtu.be/ntr64W6ZWB0",
      title: "Deadlift Technique Explained",
      description: "Learn proper deadlift form, stance, and common mistakes.",
   },
   {
      id: "2",
      url: "https://youtu.be/qTDjaS85DXc",
      title: "Beginner Strength Training",
      description: "A beginner-friendly strength training routine.",
   },
   {
      id: "3",
      url: "https://youtube.com/shorts/t2SmvH1iGjg",
      title: "Quick Mobility Drill",
      description: "Short mobility drill to improve flexibility.",
   },
   {
      id: "4",
      url: "https://youtu.be/SkNsa3eBwLA",
      title: "Full Body Workout",
      description: "High-intensity full body workout session.",
   },
   {
      id: "5",
      url: "https://youtu.be/yN6Q1UI_xkE",
      title: "Cardio Conditioning",
      description: "Improve endurance with this cardio workout.",
   },
   {
      id: "6",
      url: "https://youtu.be/5Ici1mxdX_4",
      title: "Core Strength Training",
      description: "Effective exercises to strengthen your core.",
   },
   {
      id: "7",
      url: "https://youtu.be/JyV7mUFSpXs",
      title: "Upper Body Strength",
      description: "Build upper body strength with proper form.",
   },
   {
      id: "8",
      url: "https://youtu.be/JfSee0Q-vRQ",
      title: "Lower Body Workout",
      description: "Leg day workout focusing on strength and balance.",
   },
   {
      id: "9",
      url: "https://youtu.be/PzsMitRdI_8",
      title: "Workout Motivation",
      description: "Stay motivated and push harder every workout.",
   },
]

/* ------------------ MAIN SCREEN ------------------ */
export default function ContentScreen() {
   const [activeVideo, setActiveVideo] = useState(null)
   const [playing, setPlaying] = useState(false)

   useEffect(() => {
      return () => {
         ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
         )
      }
   }, [])

   const onFullScreenChange = async (isFullScreen) => {
      if (isFullScreen) {
         await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
         )
      } else {
         await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
         )
      }
   }

   const onStateChange = useCallback((state) => {
      if (state === "ended") {
         setPlaying(false)
         setActiveVideo(null)
      }
   }, [])

   return (
      <SafeAreaView style={styles.container}>
         {/* CONTENT LIST */}
         <FlatList
            data={VIDEOS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
               const videoId = getYouTubeId(item.url)
               const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

               return (
                  <TouchableOpacity
                     style={styles.contentCard}
                     onPress={() => {
                        setActiveVideo(videoId)
                        setPlaying(true)
                     }}
                  >
                     <Image source={{ uri: thumbnail }} style={styles.thumbnail} />

                     <View style={styles.overlay}>
                        <MaterialCommunityIcons
                           name="play-circle"
                           size={52}
                           color="#FF6D00"
                        />
                     </View>

                     <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                     </View>
                  </TouchableOpacity>
               )
            }}
         />

         {/* FLOATING VIDEO MODAL */}
         <Modal
            visible={!!activeVideo}
            transparent
            animationType="fade"
            statusBarTranslucent
         >
            <View style={styles.modalBackdrop}>
               <View style={styles.modalCard}>
                  <TouchableOpacity
                     style={styles.closeButton}
                     onPress={() => {
                        setPlaying(false)
                        setActiveVideo(null)
                     }}
                  >
                     <MaterialCommunityIcons
                        name="close"
                        size={22}
                        color="#fff"
                     />
                  </TouchableOpacity>

                  <YoutubePlayer
                     height={220}
                     width={width * 0.92}
                     play={playing}
                     videoId={activeVideo}
                     onChangeState={onStateChange}
                     onFullScreenChange={onFullScreenChange}
                     forceAndroidAutoplay
                  />
               </View>
            </View>
         </Modal>
      </SafeAreaView>
   )
}

/* ------------------ STYLES ------------------ */
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
      borderRadius: 12,
      marginVertical: 10,
      overflow: "hidden",
   },
   thumbnail: {
      width: "100%",
      height: 170,
   },
   overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      alignItems: "center",
   },
   textContainer: {
      padding: 12,
   },
   title: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FF6D00",
   },
   description: {
      fontSize: 13,
      color: "#999",
      marginTop: 4,
      lineHeight: 18,
   },

   /* MODAL */
   modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
   },
   modalCard: {
      backgroundColor: "#000",
      borderRadius: 14,
      paddingTop: 28,
      paddingBottom: 10,
      elevation: 12,
   },
   closeButton: {
      position: "absolute",
      top: 6,
      right: 6,
      zIndex: 10,
   },
})
