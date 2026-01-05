import { useMemo, useState } from "react"
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Pressable,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

/* ------------------ MOCK DATA (MORE DATASETS) ------------------ */

const BOOKINGS = [
   {
      id: "1",
      title: "Personal Training",
      date: "2026-01-10",
      time: "10:00 AM - 11:00 AM",
      duration: "60 min",
      status: "upcoming",
   },
   {
      id: "2",
      title: "Yoga Class",
      date: "2025-12-20",
      time: "6:30 PM - 7:30 PM",
      duration: "60 min",
      status: "completed",
   },
   {
      id: "3",
      title: "Strength Training",
      date: "2025-12-05",
      time: "8:00 AM - 8:30 AM",
      duration: "30 min",
      status: "cancelled",
   },
   {
      id: "4",
      title: "HIIT Workout",
      date: "2026-01-18",
      time: "7:00 AM - 8:00 AM",
      duration: "60 min",
      status: "upcoming",
   },
   {
      id: "5",
      title: "Pilates Session",
      date: "2025-11-28",
      time: "5:00 PM - 6:00 PM",
      duration: "60 min",
      status: "completed",
   },
   {
      id: "6",
      title: "Cardio Blast",
      date: "2025-11-15",
      time: "6:00 AM - 6:30 AM",
      duration: "30 min",
      status: "completed",
   },
   {
      id: "7",
      title: "Cross Training",
      date: "2025-12-02",
      time: "9:00 AM - 10:00 AM",
      duration: "60 min",
      status: "cancelled",
   },
]

/* ------------------ STATUS CONFIG ------------------ */

const STATUS_CONFIG = {
   upcoming: {
      label: "Upcoming",
      color: "#00E676",
      icon: "calendar-clock",
   },
   completed: {
      label: "Completed",
      color: "#4FC3F7",
      icon: "check-circle",
   },
   cancelled: {
      label: "Cancelled",
      color: "#FF5252",
      icon: "close-circle",
   },
}

/* ------------------ FILTER OPTIONS ------------------ */

const FILTERS = [
   { key: "all", label: "All" },
   { key: "upcoming", label: "Upcoming" },
   { key: "completed", label: "Completed" },
   { key: "cancelled", label: "Cancelled" },
]

/* ------------------ COMPONENT ------------------ */

export default function MyBookingsScreen() {
   const [filter, setFilter] = useState("all")
   const [dropdownOpen, setDropdownOpen] = useState(false)

   const filteredBookings = useMemo(() => {
      if (filter === "all") return BOOKINGS
      return BOOKINGS.filter((b) => b.status === filter)
   }, [filter])

   const renderItem = ({ item }) => {
      const status = STATUS_CONFIG[item.status]

      return (
         <View style={styles.card}>
            <View style={styles.row}>
               <Text style={styles.title}>{item.title}</Text>

               <View style={styles.statusBadge}>
                  <MaterialCommunityIcons
                     name={status.icon}
                     size={14}
                     color={status.color}
                  />
                  <Text style={[styles.statusText, { color: status.color }]}>
                     {status.label}
                  </Text>
               </View>
            </View>

            <View style={styles.infoRow}>
               <MaterialCommunityIcons name="calendar" size={16} color="#aaa" />
               <Text style={styles.infoText}>{item.date}</Text>
            </View>

            <View style={styles.infoRow}>
               <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color="#aaa"
               />
               <Text style={styles.infoText}>{item.time}</Text>
            </View>

            <View style={styles.infoRow}>
               <MaterialCommunityIcons
                  name="timer-outline"
                  size={16}
                  color="#aaa"
               />
               <Text style={styles.infoText}>{item.duration}</Text>
            </View>
         </View>
      )
   }

   return (
      <View style={styles.container}>
         {/* 🔽 FILTER DROPDOWN */}
         <View style={styles.filterWrapper}>
            <Pressable
               style={styles.filterButton}
               onPress={() => setDropdownOpen((p) => !p)}
            >
               <Text style={styles.filterText}>
                  Filter: {FILTERS.find((f) => f.key === filter).label}
               </Text>
               <MaterialCommunityIcons
                  name={dropdownOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#fff"
               />
            </Pressable>

            {dropdownOpen && (
               <View style={styles.dropdown}>
                  {FILTERS.map((f) => (
                     <Pressable
                        key={f.key}
                        style={styles.dropdownItem}
                        onPress={() => {
                           setFilter(f.key)
                           setDropdownOpen(false)
                        }}
                     >
                        <Text style={styles.dropdownText}>{f.label}</Text>
                     </Pressable>
                  ))}
               </View>
            )}
         </View>

         {/* 📜 BOOKINGS LIST */}
         {filteredBookings.length === 0 ? (
            <View style={styles.emptyState}>
               <MaterialCommunityIcons
                  name="calendar-remove"
                  size={64}
                  color="#555"
               />
               <Text style={styles.emptyText}>No bookings found</Text>
            </View>
         ) : (
            <FlatList
               data={filteredBookings}
               keyExtractor={(item) => item.id}
               renderItem={renderItem}
               contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
               showsVerticalScrollIndicator={false}
            />
         )}
      </View>
   )
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#121212",
   },

   filterWrapper: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#2A2A2A",
      zIndex: 10,
   },

   filterButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#1E1E1E",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#333",
   },

   filterText: {
      color: "#fff",
      fontWeight: "700",
   },

   dropdown: {
      marginTop: 8,
      backgroundColor: "#1E1E1E",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#333",
      overflow: "hidden",
   },

   dropdownItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#2A2A2A",
   },

   dropdownText: {
      color: "#fff",
      fontSize: 14,
   },

   card: {
      backgroundColor: "#1E1E1E",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#2A2A2A",
   },

   row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
   },

   title: {
      fontSize: 16,
      fontWeight: "700",
      color: "#fff",
   },

   statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },

   statusText: {
      fontSize: 12,
      fontWeight: "700",
   },

   infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
   },

   infoText: {
      marginLeft: 8,
      fontSize: 13,
      color: "#ccc",
   },

   emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },

   emptyText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff",
      marginTop: 12,
   },
})
