import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Linking, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { useTranslate } from "../../localization/useTranslate";

export default function HelpScreen() {
   const t = useTranslate();
   const openEmail = async () => {
      const email = "webtechware25@gmail.com";
      const url = `mailto:${email}`;

      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
         Alert.alert("Error", "No email app found on this device.");
         return;
      }

      Linking.openURL(url);
   };

   const openPhone = () => {
      Linking.openURL("tel:+918003316534");
   };



   return (
      <ScrollView style={styles.container}>
         {/* Header */}
         <Text style={styles.title}>Help & Support</Text>
         <Text style={styles.subtitle}>
            We’re here to help you get the best experience with your Gym Pod sessions.
         </Text>

         {/* FAQ Section */}
         <Section title="Frequently Asked Questions">
            <Item
               icon="calendar-clock"
               title="How do I book a Gym Pod?"
               description="Select a pod, choose a time slot, and confirm your booking directly from the app."
            />
            <Item
               icon="credit-card"
               title="How much does a session cost?"
               description="A standard session is booked in 30-minute blocks. Prices may vary by location and time."
            />
            <Item
               icon="cancel"
               title="Can I cancel or reschedule?"
               description="Yes. You can cancel or reschedule within the allowed time window shown during booking."
            />
            <Item
               icon="account-multiple"
               title="Can I bring someone with me?"
               description="Some pods allow multiple users. Check pod details before booking."
            />
         </Section>

         {/* Support Section */}
         <Section title="Contact Support">
            <Item
               icon="email"
               title="Email Us"
               description="webtechware25@gmail.com"
               onPress={openEmail}
            />
            <Item
               icon="phone"
               title="Call Support"
               description="+918003316534"
               onPress={openPhone}
            />
         </Section>

         {/* Footer */}
         <Text style={styles.footer}>
            Gym Pod Support • Available 24/7
         </Text>
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
      <TouchableOpacity
         style={styles.item}
         activeOpacity={0.8}
         onPress={onPress}
      >
         <MaterialCommunityIcons
            name={icon}
            size={26}
            color="#FF6D00"
         />
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
   },
   section: {
      marginBottom: 38,
   },
   sectionTitle: {
      fontSize: 18,
      color: "#fff",
      marginBottom: 12,
      fontWeight: "600",
   },
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
   footer: {
      textAlign: "center",
      color: "#666",
      fontSize: 12,
      marginTop: 10,
      marginBottom: 160,
   },
});
