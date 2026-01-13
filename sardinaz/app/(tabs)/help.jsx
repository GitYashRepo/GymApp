import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Linking, Alert } from "react-native";
import { useTranslate } from "../../localization/useTranslate";

export default function HelpScreen() {
   const t = useTranslate();

   const openEmail = async () => {
      const email = "sardinazgym@gmail.com";
      const url = `mailto:${email}`;

      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
         Alert.alert("Error", "No email app found on this device.");
         return;
      }

      Linking.openURL(url);
   };

   const openPhoneOne = () => Linking.openURL("tel:+85293605397");
   const openPhoneTwo = () => Linking.openURL("tel:+85297935676");

   const openInstagram = async () => {
      const url = "https://www.instagram.com/p/DTNr_qMk1wX/?igsh=MW03OGF1ZHJiYnU3cA==";
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
         Alert.alert("Error", "Instagram is not available on this device.");
         return;
      }
      Linking.openURL(url);
   };

   const openWebsite = async () => {
      const url = "https://www.sardinazgym.com";
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
         Alert.alert("Error", "Unable to open website.");
         return;
      }
      Linking.openURL(url);
   };

   return (
      <ScrollView style={styles.container}>
         {/* Header */}
         <Text style={styles.title}>{t("helpPage.title")}</Text>
         <Text style={styles.subtitle}>{t("helpPage.subtitle")}</Text>

         {/* FAQ Section */}
         <Section title={t("helpPage.faqTitle")}>
            <Item
               icon="calendar-clock"
               title={t("helpPage.faqBookTitle")}
               description={t("helpPage.faqBookDesc")}
            />
            <Item
               icon="credit-card"
               title={t("helpPage.faqPriceTitle")}
               description={t("helpPage.faqPriceDesc")}
            />
            <Item
               icon="cancel"
               title={t("helpPage.faqCancelTitle")}
               description={t("helpPage.faqCancelDesc")}
            />
            <Item
               icon="account-multiple"
               title={t("helpPage.faqGuestTitle")}
               description={t("helpPage.faqGuestDesc")}
            />
         </Section>

         {/* Support Section */}
         <Section title={t("helpPage.contactTitle")}>
            <Item
               icon="email"
               title={t("helpPage.emailUs")}
               description="sardinazgym@gmail.com"
               onPress={openEmail}
            />
            <Item
               icon="phone"
               title={t("helpPage.callSupport")}
               description="+85293605397"
               onPress={openPhoneOne}
            />
            <Item
               icon="phone"
               title={t("helpPage.callSupport")}
               description="+85297935676"
               onPress={openPhoneTwo}
            />
            <Item
               icon="web"
               title={t("helpPage.visitWebsite")}
               description="www.sardinazgym.com"
               onPress={openWebsite}
            />
         </Section>

         {/* Social Media Section */}
         <Section title={t("helpPage.socialTitle")}>
            <Item
               icon="instagram"
               title="@sardinazgym"
               description={t("helpPage.followDesc")}
               onPress={openInstagram}
            />
         </Section>

         {/* Footer */}
         <Text style={styles.footer}>{t("helpPage.footer")}</Text>
      </ScrollView>
   );
}

/* ---------- Reusable Components ---------- */

function Section({ title, children }) {
   return (
      <View style={styles.section}>
         <Text style={styles.sectionTitle}>{title}</Text>
         {children}
      </View>
   );
}

function Item({ icon, title, description, onPress }) {
   return (
      <TouchableOpacity style={styles.item} activeOpacity={0.8} onPress={onPress}>
         <MaterialCommunityIcons name={icon} size={26} color="#FF6D00" />
         <View style={styles.itemText}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.itemDesc}>{description}</Text>
         </View>
      </TouchableOpacity>
   );
}


/* ---------- Styles ---------- */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#121212",
      padding: 20,
   },

   /* ---------- Header ---------- */
   title: {
      fontSize: 24,
      color: "#FF6D00",
      fontWeight: "700",
      marginBottom: 8,
   },
   subtitle: {
      color: "#aaa",
      fontSize: 14,
      marginBottom: 20,
      lineHeight: 20,
   },

   /* ---------- Section ---------- */
   section: {
      marginBottom: 38,
   },
   sectionTitle: {
      fontSize: 18,
      color: "#fff",
      marginBottom: 12,
      fontWeight: "600",
   },

   /* ---------- Item ---------- */
   item: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: "#1e1e1e",
      padding: 14,
      borderRadius: 10,
      marginBottom: 12,
   },
   itemText: {
      marginLeft: 14,
      flex: 1,
   },
   itemTitle: {
      fontSize: 15,
      color: "#fff",
      fontWeight: "600",
      marginBottom: 2,
   },
   itemDesc: {
      fontSize: 13,
      color: "#aaa",
      lineHeight: 18,
   },

   /* ---------- Footer ---------- */
   footer: {
      textAlign: "center",
      color: "#666",
      fontSize: 12,
      marginTop: 10,
      marginBottom: 160,
   },
});
