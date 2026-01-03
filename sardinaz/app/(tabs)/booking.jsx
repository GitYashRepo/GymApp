"use client"

import { useState, useMemo } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"
import { Clock, Info } from "lucide-react-native"



const BOOKING_LOCATION = "Change City Point"

const DUMMY_TIME_SLOTS = [
   "7:00 AM",
   "7:30 AM",
   "8:00 AM",
   "8:30 AM",
   "9:00 AM",
   "9:30 AM",
   "10:00 AM",
   "10:30 AM",
   "11:00 AM",
   "11:30 AM",
   "12:00 PM",
   "12:30 PM",
   "1:00 PM",
   "1:30 PM",
   "2:00 PM",
   "2:30 PM",
   "3:00 PM",
   "3:30 PM",
   "4:00 PM",
   "4:30 PM",
   "5:00 PM",
   "5:30 PM",
   "6:00 PM",
   "6:30 PM",
   "7:00 PM",
   "7:30 PM",
   "8:00 PM",
   "8:30 PM",
   "9:30 PM",
   "10:00 PM",
]

const generateBookingSlots = () => {
   const slots = []
   let slotNumber = 1
   DUMMY_TIME_SLOTS.forEach((time) => {
      for (let i = 0; i < 6; i++) {
         slots.push({
            id: `${time}-${i}`,
            slotNumber: `${slotNumber.toString().padStart(3, "0")}`,
            isAvailable: Math.random() > 0.3,
            timeSlot: time,
         })
         slotNumber++
      }
   })
   return slots
}

const BookingSlotItem = ({ slot, isSelected, onPress }) => {
   return (
      <TouchableOpacity
         style={[
            styles.slotItem,
            isSelected ? styles.slotSelected : slot.isAvailable ? styles.slotAvailable : styles.slotUnavailable,
         ]}
         onPress={onPress}
      >
         <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}></Text>
      </TouchableOpacity>
   )
}

export default function BookingScreen() {
   const [selectedSlot, setSelectedSlot] = useState(null)
   const [selectedTime, setSelectedTime] = useState("FROM NOW")
   const parkingSlots = useMemo(() => generateBookingSlots(), [])

   const groupedByTime = useMemo(() => {
      const grouped = {}
      parkingSlots.forEach((slot) => {
         if (!grouped[slot.timeSlot]) {
            grouped[slot.timeSlot] = []
         }
         grouped[slot.timeSlot].push(slot)
      })
      return Object.entries(grouped).map(([time, slots]) => ({ time, slots }))
   }, [parkingSlots])

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
               <Text style={styles.headerTitle}>{BOOKING_LOCATION}</Text>
               <View style={styles.headerIcons}>
                  <TouchableOpacity style={styles.headerIconButton}>
                     <Info size={20} color="#fff" />
                  </TouchableOpacity>
               </View>
            </View>
         </View>

         {/* Legend */}
         <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
               <View style={[styles.legendBox, { backgroundColor: "#FF6D00" }]} />
               <Text style={styles.legendText}>30 min.</Text>
            </View>
            <View style={styles.legendItem}>
               <View style={[styles.legendBox, { backgroundColor: "#444" }]} />
               <Text style={styles.legendText}>Not available</Text>
            </View>
         </View>

         {/* Parking Grid */}
         <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Time Labels */}
            <View style={styles.gridContainer}>
               {/* Left Timeline */}
               <View style={styles.timelineColumn}>
                  {DUMMY_TIME_SLOTS.map((time, index) => (
                     <View key={`time-${index}`} style={styles.timeSlot}>
                        <Text style={styles.timeText}>{time}</Text>
                     </View>
                  ))}
               </View>

               {/* Booking Slots Grid */}
               <View style={styles.slotsColumn}>
                  <View style={styles.slotsGrid}>
                     {groupedByTime.map((group, timeIndex) => (
                        <View key={`group-${timeIndex}`} style={styles.slotRow}>
                           {group.slots.map((slot) => (
                              <BookingSlotItem
                                 key={slot.id}
                                 slot={slot}
                                 isSelected={selectedSlot === slot.id}
                                 onPress={() => setSelectedSlot(selectedSlot === slot.id ? null : slot.id)}
                              />
                           ))}
                        </View>
                     ))}
                  </View>
               </View>
            </View>
         </ScrollView>

         {/* Bottom Action Bar */}
         <View style={styles.bottomBar}>
            <View style={styles.timeSelectionContainer}>
               <Clock size={18} color="#FF6D00" />
               <Text style={styles.timeSelectionText}>{selectedTime}</Text>
            </View>

            <View style={styles.bookingDetails}>
               <Text style={styles.bookingText}>1 Slot</Text>
               <Text style={styles.bookingText}>30 min</Text>
            </View>

            <TouchableOpacity style={styles.bookButton}>
               <Text style={styles.bookButtonText}>BOOK NOW</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#1a1a1a",
   },
   headerContainer: {
      backgroundColor: "#FF6D00",
      paddingHorizontal: 16,
      paddingVertical: 12,
   },
   headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
   },
   headerIcons: {
      flexDirection: "row",
      gap: 8,
   },
   headerIconButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.1)",
      justifyContent: "center",
      alignItems: "center",
   },
   legendContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 32,
      backgroundColor: "#222",
   },
   legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
   },
   legendBox: {
      width: 20,
      height: 20,
      borderRadius: 4,
   },
   legendText: {
      fontSize: 12,
      color: "#999",
   },
   scrollContent: {
      flex: 1,
   },
   gridContainer: {
      flexDirection: "row",
      paddingHorizontal: 12,
      paddingVertical: 16,
   },
   timelineColumn: {
      paddingRight: 8,
      justifyContent: "space-around",
      minWidth: 60,
   },
   timeSlot: {
      height: 56,
      justifyContent: "center",
   },
   timeText: {
      fontSize: 11,
      color: "#666",
      fontWeight: "500",
   },
   slotsColumn: {
      flex: 1,
   },
   slotsGrid: {
      gap: 8,
   },
   slotRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: 56,
   },
   slotItem: {
      flex: 1,
      margin: 2,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 52,
   },
   slotAvailable: {
      backgroundColor: "#333",
   },
   slotSelected: {
      backgroundColor: "#FF6D00",
   },
   slotUnavailable: {
      backgroundColor: "#2a2a2a",
   },
   slotText: {
      fontSize: 11,
      fontWeight: "600",
      color: "#666",
   },
   slotTextSelected: {
      color: "#000",
   },
   bottomBar: {
      backgroundColor: "#FF6D00",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
   },
   timeSelectionContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
   },
   timeSelectionText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#000",
   },
   bookingDetails: {
      flexDirection: "row",
      gap: 12,
   },
   bookingText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#000",
   },
   bookButton: {
      backgroundColor: "#000",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
   },
   bookButtonText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#FF6D00",
   },
})
