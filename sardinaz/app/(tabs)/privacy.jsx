import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   SafeAreaView,
} from "react-native"
import { useTranslate } from "../../localization/useTranslate"

export default function PrivacySecurityScreen() {
   const t = useTranslate()

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
         >
            <Text style={styles.title}>Privacy & Security Policy</Text>

            <Text style={styles.updated}>
               Last updated: January 2026
            </Text>

            <Section
               title="1. Introduction"
               text="SARDINAZ Gym respects your privacy and is committed to protecting your personal information. This Privacy & Security Policy explains how we collect, use, store, and protect your data when you use our mobile application."
            />

            <Section
               title="2. Information We Collect"
               text="We may collect personal information including your name, email address, profile image, booking history, preferences, and app usage data when you register, make bookings, or interact with the app."
            />

            <Section
               title="3. How We Use Your Information"
               text="Your information is used to manage your account, process bookings, personalize your experience, improve our services, and communicate important updates related to your membership or the app."
            />

            <Section
               title="4. Profile Images & Media"
               text="If you choose to upload a profile image, it is securely stored and used only for identification purposes within the app. We do not sell or share your images with third parties."
            />

            <Section
               title="5. Data Sharing"
               text="We do not sell, rent, or trade your personal data. Your information may only be shared with trusted service providers when required to operate the app or comply with legal obligations."
            />

            <Section
               title="6. Data Retention"
               text="We retain your personal data only for as long as necessary to fulfill the purposes described in this policy or as required by applicable laws and regulations."
            />

            {/* ---------------- SECURITY SECTION ---------------- */}

            <Section
               title="7. Account Security"
               text="Your account is protected using secure authentication mechanisms. You are responsible for keeping your login credentials confidential and should not share your password with anyone."
            />

            <Section
               title="8. Authentication & Access Control"
               text="Access to your account and data is protected using authentication tokens and role-based access controls. Administrative features are restricted to authorized personnel only."
            />

            <Section
               title="9. Data Encryption"
               text="Sensitive data transmitted between your device and our servers is protected using encrypted connections (HTTPS). Where applicable, stored data is secured using industry-standard encryption practices."
            />

            <Section
               title="10. Device & App Security"
               text="We recommend keeping your device operating system and the SARDINAZ app updated to ensure you benefit from the latest security enhancements and protections."
            />

            <Section
               title="11. Security Incidents"
               text="In the event of a security breach or data incident, we will take immediate action to mitigate the issue and notify affected users in accordance with applicable laws and regulations."
            />

            <Section
               title="12. Your Responsibilities"
               text="You are responsible for maintaining the security of your device and account. Please notify us immediately if you suspect unauthorized access or unusual activity on your account."
            />

            {/* ---------------- USER RIGHTS ---------------- */}

            <Section
               title="13. Your Rights"
               text="You have the right to access, update, or request deletion of your personal data. You may exercise these rights through the app or by contacting our support team."
            />

            <Section
               title="14. Account Deletion"
               text="If you wish to delete your account, please contact us through the Help & Support section. Upon deletion, your personal data will be permanently removed unless retention is required by law."
            />

            <Section
               title="15. Changes to This Policy"
               text="We may update this Privacy & Security Policy from time to time. Any changes will be reflected in the app along with an updated revision date."
            />

            <Section
               title="16. Contact Us"
               text="If you have any questions or concerns regarding this policy, please contact us through the Help & Support section of the app."
            />

            <View style={styles.footer}>
               <Text style={styles.footerText}>
                  © {new Date().getFullYear()} SARDINAZ Gym. All rights reserved.
               </Text>
            </View>
         </ScrollView>
      </SafeAreaView>
   )
}

/* ------------------ SECTION COMPONENT ------------------ */

function Section({ title, text }) {
   return (
      <View style={styles.section}>
         <Text style={styles.sectionTitle}>{title}</Text>
         <Text style={styles.sectionText}>{text}</Text>
      </View>
   )
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#1a1a1a",
   },
   content: {
      padding: 20,
      paddingBottom: 80,
   },
   title: {
      fontSize: 26,
      fontWeight: "700",
      color: "#FF6D00",
      marginBottom: 6,
   },
   updated: {
      fontSize: 12,
      color: "#888",
      marginBottom: 20,
   },
   section: {
      marginBottom: 18,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#fff",
      marginBottom: 6,
   },
   sectionText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#ccc",
   },
   footer: {
      marginTop: 30,
      borderTopWidth: 1,
      borderTopColor: "#333",
      paddingTop: 16,
   },
   footerText: {
      fontSize: 12,
      color: "#777",
      textAlign: "center",
      marginBottom: 40
   },
})
