"use client"

import React, { useMemo, useState, useCallback, memo } from "react"
import {
   View,
   Text,
   ScrollView,
   StyleSheet,
   Pressable,
   SafeAreaView,
} from "react-native"
import { Info } from "lucide-react-native"

/* ------------------ CONSTANTS ------------------ */

const CELL_WIDTH = 72
const CELL_HEIGHT = 54
const TIME_COL_WIDTH = 70

/* ------------------ DATE HELPERS ------------------ */

const formatDate = (date, options) =>
   new Intl.DateTimeFormat("en-US", options).format(date)

const getRemainingDaysOfMonth = () => {
   const today = new Date()
   const y = today.getFullYear()
   const m = today.getMonth()
   const lastDay = new Date(y, m + 1, 0).getDate()

   const days = []
   for (let d = today.getDate(); d <= lastDay; d++) {
      const date = new Date(y, m, d)
      days.push({
         id: date.toISOString().split("T")[0],
         day: formatDate(date, { weekday: "short" }),
         date: formatDate(date, { day: "numeric" }),
         monthYear: formatDate(date, { month: "long", year: "numeric" }),
      })
   }
   return days
}

/* ------------------ TIME SLOTS ------------------ */

const TIME_SLOTS = (() => {
   const slots = []
   let hour = 6
   let minute = 0

   while (hour < 23 || (hour === 23 && minute === 0)) {
      const period = hour >= 12 ? "PM" : "AM"
      const displayHour = hour % 12 === 0 ? 12 : hour % 12
      const displayMinute = minute === 0 ? "00" : "30"

      slots.push(`${displayHour}:${displayMinute} ${period}`)

      minute += 30
      if (minute === 60) {
         minute = 0
         hour++
      }
   }

   return slots
})()

/* ------------------ SLOT CELL (MEMOIZED) ------------------ */

const SlotCell = memo(function SlotCell({ isSelected, onPress }) {
   return (
      <Pressable
         onPress={onPress}
         style={({ pressed }) => [
            styles.slotCell,
            isSelected && styles.slotSelected,
            pressed && { opacity: 0.8 },
         ]}
      />
   )
})

/* ------------------ MAIN COMPONENT ------------------ */

export default function BookingScreen() {
   const days = useMemo(() => getRemainingDaysOfMonth(), [])
   const [selectedSlots, setSelectedSlots] = useState({})

   const toggleSlot = useCallback((dayId, time) => {
      const key = `${dayId}_${time}`
      setSelectedSlots((prev) => {
         const next = { ...prev }
         next[key] ? delete next[key] : (next[key] = true)
         return next
      })
   }, [])

   return (
      <SafeAreaView style={styles.container}>
         {/* HEADER */}
         <View style={styles.header}>
            <Text style={styles.headerTitle}>Changi City Point</Text>
            <Info size={18} color="#000" />
         </View>

         {/* MONTH */}
         <View style={styles.monthHeader}>
            <Text style={styles.monthText}>{days[0].monthYear}</Text>
         </View>

         {/* GRID */}
         <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.gridWrapper}>
               {/* TIME COLUMN */}
               <View style={styles.timeColumn}>
                  <View style={{ height: CELL_HEIGHT }} />
                  {TIME_SLOTS.map((time) => (
                     <View key={time} style={styles.timeCell}>
                        <Text style={styles.timeText}>{time}</Text>
                     </View>
                  ))}
               </View>

               {/* DAYS + SLOTS */}
               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                     {/* DAY HEADER */}
                     <View style={styles.dayHeaderRow}>
                        {days.map((day) => (
                           <View key={day.id} style={styles.dayHeaderCell}>
                              <Text style={styles.dayText}>{day.day}</Text>
                              <Text style={styles.dateText}>{day.date}</Text>
                           </View>
                        ))}
                     </View>

                     {/* SLOT GRID */}
                     {TIME_SLOTS.map((time) => (
                        <View key={time} style={styles.slotRow}>
                           {days.map((day) => {
                              const key = `${day.id}_${time}`
                              return (
                                 <SlotCell
                                    key={key}
                                    isSelected={!!selectedSlots[key]}
                                    onPress={() => toggleSlot(day.id, time)}
                                 />
                              )
                           })}
                        </View>
                     ))}
                  </View>
               </ScrollView>
            </View>
         </ScrollView>

         {/* FOOTER */}
         <View style={styles.footer}>
            <Text style={styles.footerText}>
               {Object.keys(selectedSlots).length} Slot(s) · 30 min
            </Text>
            <View style={styles.bookBtn}>
               <Text style={styles.bookText}>BOOK NOW</Text>
            </View>
         </View>
      </SafeAreaView>
   )
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#111" },

   header: {
      backgroundColor: "#F4C400",
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
   },
   headerTitle: { fontWeight: "700", fontSize: 16 },

   monthHeader: {
      alignItems: "center",
      paddingVertical: 8,
      backgroundColor: "#1c1c1c",
   },
   monthText: { color: "#F4C400", fontWeight: "700" },

   gridWrapper: {
      flexDirection: "row",
      paddingTop: 10,
      paddingBottom: 30,
   },

   timeColumn: { width: TIME_COL_WIDTH },
   timeCell: {
      height: CELL_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
   },
   timeText: { color: "#aaa", fontSize: 11 },

   dayHeaderRow: { flexDirection: "row", height: CELL_HEIGHT },
   dayHeaderCell: {
      width: CELL_WIDTH,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#222",
      borderRightWidth: 1,
      borderColor: "#333",
   },
   dayText: { color: "#aaa", fontSize: 12 },
   dateText: { color: "#fff", fontWeight: "700" },

   slotRow: { flexDirection: "row" },
   slotCell: {
      width: CELL_WIDTH,
      height: CELL_HEIGHT,
      backgroundColor: "#2b2b2b",
      borderWidth: 0.5,
      borderColor: "#1a1a1a",
   },
   slotSelected: {
      backgroundColor: "#F4C400",
   },

   footer: {
      backgroundColor: "#F4C400",
      padding: 14,
      marginBottom: 80,
      flexDirection: "row",
      justifyContent: "space-between",
   },
   footerText: { fontWeight: "700" },
   bookBtn: {
      backgroundColor: "#000",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 6,
   },
   bookText: { color: "#F4C400", fontWeight: "700" },
})
