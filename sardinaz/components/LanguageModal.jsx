import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"



export default function LanguageModal({ isVisible, onClose, onSelectLanguage }) {
   const languages = [
      { id: "en", label: "English", flag: "🇬🇧" },
      { id: "zh-cn", label: "简体中文 (Simplified Chinese)", flag: "🇨🇳" },
      { id: "zh-tw", label: "繁體中文 (Traditional Chinese)", flag: "🇹🇼" },
      { id: "mn", label: "粤語 (Cantonese)", flag: "🇭🇰" },
   ]

   const handleLanguageSelect = (languageId) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onSelectLanguage(languageId)
      onClose()
   }

   return (
      <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
            <View style={styles.modalContainer}>
               <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                     <Text style={styles.modalTitle}>Select Language</Text>
                     <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                        <MaterialCommunityIcons name="close" size={24} color="#FFD500" />
                     </TouchableOpacity>
                  </View>

                  <View style={styles.languageList}>
                     {languages.map((lang) => (
                        <TouchableOpacity
                           key={lang.id}
                           style={styles.languageItem}
                           onPress={() => handleLanguageSelect(lang.id)}
                           activeOpacity={0.7}
                        >
                           <Text style={styles.flag}>{lang.flag}</Text>
                           <Text style={styles.languageLabel}>{lang.label}</Text>
                           <MaterialCommunityIcons name="chevron-right" size={20} color="#FFD500" />
                        </TouchableOpacity>
                     ))}
                  </View>
               </View>
            </View>
         </TouchableOpacity>
      </Modal>
   )
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
   },
   modalContainer: {
      width: "100%",
      backgroundColor: "#1a1a1a",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 16,
   },
   modalContent: {
      maxHeight: "80%",
   },
   modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#333",
   },
   modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFD500",
   },
   languageList: {
      paddingVertical: 12,
   },
   languageItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#333",
   },
   flag: {
      fontSize: 24,
      marginRight: 12,
   },
   languageLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      color: "#fff",
   },
})
