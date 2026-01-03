import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../store/languageSlice";
import { useTranslate } from "../localization/useTranslate";

export default function LanguageModal({ isVisible, onClose }) {
   const t = useTranslate();
   const dispatch = useDispatch();

   // 🔥 Single source of truth
   const currentLocale = useSelector((state) => state.language.locale);

   const handleLanguageSelect = (languageId) => {
      if (languageId === currentLocale) {
         onClose();
         return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      dispatch(setLanguage(languageId));
      onClose();
   };

   const languages = [
      { id: "en", label: "English", flag: "🇬🇧" },
      { id: "zh-Hans", label: "简体中文", flag: "🇨🇳" },
      { id: "zh-Hant", label: "繁體中文（香港）", flag: "🇭🇰" },
   ];

   return (
      <Modal
         transparent
         visible={isVisible}
         animationType="fade"
         onRequestClose={onClose}
      >
         <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={onClose}
         >
            <View style={styles.modalContainer}>
               <View style={styles.modalContent}>
                  {/* Header */}
                  <View style={styles.modalHeader}>
                     <Text style={styles.modalTitle}>
                        {t("common.select_language")}
                     </Text>
                     <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                        <MaterialCommunityIcons
                           name="close"
                           size={24}
                           color="#FF6D00"
                        />
                     </TouchableOpacity>
                  </View>

                  {/* Language list */}
                  <View style={styles.languageList}>
                     {languages.map((lang) => {
                        const isSelected = lang.id === currentLocale;

                        return (
                           <TouchableOpacity
                              key={lang.id}
                              style={[
                                 styles.languageItem,
                                 isSelected && styles.languageItemSelected,
                              ]}
                              onPress={() => handleLanguageSelect(lang.id)}
                              activeOpacity={0.7}
                           >
                              <Text style={styles.flag}>{lang.flag}</Text>

                              <Text style={styles.languageLabel}>
                                 {lang.label}
                              </Text>

                              {isSelected ? (
                                 <MaterialCommunityIcons
                                    name="check"
                                    size={22}
                                    color="#FF6D00"
                                 />
                              ) : (
                                 <MaterialCommunityIcons
                                    name="chevron-right"
                                    size={20}
                                    color="#FF6D00"
                                 />
                              )}
                           </TouchableOpacity>
                        );
                     })}
                  </View>
               </View>
            </View>
         </TouchableOpacity>
      </Modal>
   );
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
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
      color: "#FF6D00",
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
   languageItemSelected: {
      backgroundColor: "rgba(255,109,0,0.12)",
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
});
