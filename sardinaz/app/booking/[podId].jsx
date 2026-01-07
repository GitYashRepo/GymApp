"use client"

import React, { useMemo, useState, useEffect } from "react"
import {
   View,
   Text,
   ScrollView,
   StyleSheet,
   Pressable,
   SafeAreaView,
   Modal,
   Image,
} from "react-native"
import { useLocalSearchParams } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import api from "../../services/api"

/* ------------------ DATE HELPERS ------------------ */

const getLocalDateId = (date = new Date()) => {
   const y = date.getFullYear()
   const m = String(date.getMonth() + 1).padStart(2, "0")
   const d = String(date.getDate()).padStart(2, "0")
   return `${y}-${m}-${d}`
}

const buildSlotDate = (dayId, timeLabel) => {
   const [time, period] = timeLabel.split(" ")
   let [hour, minute] = time.split(":").map(Number)

   if (period === "PM" && hour !== 12) hour += 12
   if (period === "AM" && hour === 12) hour = 0

   const [y, m, d] = dayId.split("-").map(Number)
   return new Date(y, m - 1, d, hour, minute)
}

const isPastSlot = (dayId, startTime) => {
   if (dayId !== getLocalDateId()) return false
   return startTime < new Date()
}

/* ------------------ PRICING ------------------ */

const SLOT_PRICE = 39

const calculatePrice = (selectedSlots) => {
   const slots = Object.values(selectedSlots)
   let total = 0
   for (const slot of slots) {
      total += slot.persons * SLOT_PRICE
   }
   return total
}

/* ------------------ DATE GENERATOR ------------------ */

const generateDates = () => {
   const today = new Date()
   today.setHours(0, 0, 0, 0)

   const dates = []
   const y = today.getFullYear()
   const m = today.getMonth()

   const addMonth = (year, month) => {
      const last = new Date(year, month + 1, 0).getDate()
      for (let d = 1; d <= last; d++) {
         const date = new Date(year, month, d)
         date.setHours(0, 0, 0, 0)
         if (date < today) continue

         dates.push({
            id: getLocalDateId(date),
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            date: date.getDate(),
            month: date.toLocaleDateString("en-US", {
               month: "long",
               year: "numeric",
            }),
            monthIndex: month,
         })
      }
   }

   addMonth(y, m)
   if (new Date(y, m + 1, 0).getDate() - today.getDate() <= 10) {
      addMonth(y, m + 1)
   }

   return dates
}

/* ------------------ TIME SLOTS ------------------ */

const TIME_SLOTS = (() => {
   const slots = []
   let h = 6
   let m = 0
   while (h < 23) {
      const p = h >= 12 ? "PM" : "AM"
      const dh = h % 12 === 0 ? 12 : h % 12
      const dm = m === 0 ? "00" : "30"
      slots.push(`${dh}:${dm} ${p}`)
      m += 30
      if (m === 60) {
         m = 0
         h++
      }
   }
   return slots
})()

/* ------------------ GRID CONSTANTS ------------------ */

const CELL_WIDTH = 72
const CELL_HEIGHT = 54
const TIME_COL_WIDTH = 70


/* ------------------ MAIN ------------------ */

export default function BookingScreen() {
   const { podId } = useLocalSearchParams()
   const days = useMemo(() => generateDates(), [])

   const [pod, setPod] = useState(null)
   const [availability, setAvailability] = useState({})
   const [selectedSlots, setSelectedSlots] = useState({})

   const [slotModal, setSlotModal] = useState(false)
   const [paymentModal, setPaymentModal] = useState(false)

   const [activeSlot, setActiveSlot] = useState(null)
   const [persons, setPersons] = useState(1)
   const [paymentImage, setPaymentImage] = useState(null)

   const totalSlots = Object.keys(selectedSlots).length
   const totalPersons = Object.values(selectedSlots).reduce(
      (s, x) => s + x.persons,
      0
   )

   const totalAmount = calculatePrice(selectedSlots)

   const isTodayBooking = Object.values(selectedSlots).some(
      s => s.dayId === getLocalDateId()
   )

   /* ------------------ FETCH POD ------------------ */

   useEffect(() => {
      if (!podId) return

      api.get(`/pods/${podId}`)
         .then(r => setPod(r.data.data))
         .catch(err => console.log("❌ Pod fetch error:", err.response?.data))
   }, [podId])


   /* ------------------ FETCH AVAILABILITY ------------------ */

   useEffect(() => {
      if (!podId || !pod) return

      days.forEach(async d => {
         try {
            const res = await api.get(
               `/bookings/availability/${podId}?date=${d.id}`
            )

            const map = {}
            res.data.data.forEach(s => {
               map[new Date(s.startTime).getTime()] = s
            })

            setAvailability(p => ({ ...p, [d.id]: map }))
         } catch (err) {
            console.log(
               "❌ Availability error:",
               err.response?.status,
               err.response?.data
            )
         }
      })
   }, [podId, pod])


   /* ------------------ SLOT ACTIONS ------------------ */

   const openSlot = (day, time) => {
      const start = buildSlotDate(day.id, time)
      const key = start.getTime()

      const slot =
         availability[day.id]?.[key] || {
            bookedPersons: 0,
            maxCapacity: pod.maxCapacity,
         }

      if (slot.bookedPersons >= slot.maxCapacity) return
      if (isPastSlot(day.id, start)) return

      const remainingCapacity =
         slot.maxCapacity - slot.bookedPersons

      const initialPersons = Math.min(
         selectedSlots[key]?.persons || 1,
         remainingCapacity
      )

      setPersons(initialPersons)

      setActiveSlot({
         key,
         dayId: day.id,
         startTime: start,
         slot,
         remainingCapacity,
      })

      setSlotModal(true)
   }


   const confirmSlot = () => {
      if (!activeSlot) return

      if (persons > activeSlot.remainingCapacity) {
         alert("Selected persons exceed available capacity")
         return
      }

      setSelectedSlots(p => ({
         ...p,
         [activeSlot.key]: { ...activeSlot, persons },
      }))

      setSlotModal(false)
      setActiveSlot(null)
   }


   const removeSlot = () => {
      setSelectedSlots(p => {
         const n = { ...p }
         delete n[activeSlot.key]
         return n
      })
      setSlotModal(false)
      setActiveSlot(null)
   }

   /* ------------------ PAYMENT ------------------ */

   const pickImage = async () => {
      const r = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
      })
      if (!r.canceled) setPaymentImage(r.assets[0])
   }

   const confirmPayment = async () => {
      for (const s of Object.values(selectedSlots)) {
         await api.post("/bookings", {
            gymPodId: podId,
            slotDate: s.dayId,
            startTime: s.startTime,
            personsCount: s.persons,
         })
      }

      setSelectedSlots({})
      setPaymentImage(null)
      setPaymentModal(false)
   }

   /* ------------------ RENDER ------------------ */

   let lastMonth = null

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.headerTitle}>{days[0]?.month}</Text>
         </View>

         <ScrollView>
            <View style={styles.gridWrapper}>
               <View style={styles.timeColumn}>
                  <View style={{ height: CELL_HEIGHT }} />
                  {TIME_SLOTS.map(t => (
                     <View key={t} style={styles.timeCell}>
                        <Text style={styles.timeText}>{t}</Text>
                     </View>
                  ))}
               </View>

               <ScrollView horizontal>
                  <View>
                     <View style={styles.dayHeaderRow}>
                        {days.map(d => {
                           const gap =
                              lastMonth !== null &&
                              lastMonth !== d.monthIndex
                           lastMonth = d.monthIndex
                           return (
                              <View key={d.id}>
                                 {gap && <View style={styles.monthGap} />}
                                 <View style={styles.dayCell}>
                                    <Text style={styles.dayText}>{d.day}</Text>
                                    <Text style={styles.dateText}>{d.date}</Text>
                                 </View>
                              </View>
                           )
                        })}
                     </View>

                     {TIME_SLOTS.map(t => (
                        <View key={t} style={styles.slotRow}>
                           {days.map(d => {
                              const start = buildSlotDate(d.id, t)
                              const key = start.getTime()

                              const slot =
                                 availability[d.id]?.[key] || {
                                    bookedPersons: 0,
                                    maxCapacity: pod?.maxCapacity || 1,
                                 }

                              const isSelected = !!selectedSlots[key]
                              const isFull =
                                 slot.bookedPersons >= slot.maxCapacity
                              const isPast = isPastSlot(d.id, start)

                              return (
                                 <Pressable
                                    key={d.id}
                                    disabled={isFull || isPast}
                                    onPress={() => openSlot(d, t)}
                                    style={[
                                       styles.slot,
                                       isSelected && styles.slotSelected,
                                       isFull && styles.slotFull,
                                       isPast && styles.slotPast,
                                    ]}
                                 >
                                    {isSelected ? (
                                       <Text style={styles.slotText}>
                                          {selectedSlots[key].persons}
                                       </Text>
                                    ) : slot.bookedPersons > 0 ? (
                                       <Text style={styles.slotText}>
                                          {slot.bookedPersons}/{slot.maxCapacity}
                                       </Text>
                                    ) : null}
                                 </Pressable>
                              )
                           })}
                        </View>
                     ))}
                  </View>
               </ScrollView>
            </View>
         </ScrollView>

         <View style={styles.footer}>
            <Text style={styles.footerText}>
               {totalSlots} Slot(s) · {totalPersons} Person(s)
            </Text>
            <Pressable
               style={styles.bookBtn}
               disabled={totalSlots === 0}
               onPress={() => setPaymentModal(true)}
            >
               <Text style={styles.bookText}>BOOK NOW</Text>
            </Pressable>
         </View>

         {/* SLOT MODAL */}
         <Modal transparent visible={slotModal}>
            <View style={styles.modalBg}>
               <View style={styles.modal}>
                  <Pressable
                     style={styles.closeBtn}
                     onPress={() => setSlotModal(false)}
                  >
                     <Text style={styles.closeText}>✕</Text>
                  </Pressable>

                  <Text style={styles.modalTitle}>Select Persons</Text>

                  <View style={styles.counter}>
                     <Pressable
                        onPress={() => setPersons(p => Math.max(1, p - 1))}
                     >
                        <Text style={styles.counterBtn}>−</Text>
                     </Pressable>
                     <Text style={styles.counterVal}>{persons}</Text>
                     <Pressable
                        disabled={
                           !activeSlot || persons >= activeSlot.remainingCapacity
                        }
                        onPress={() => {
                           if (!activeSlot) return
                           setPersons(p =>
                              Math.min(p + 1, activeSlot.remainingCapacity)
                           )
                        }}
                     >
                        <Text style={styles.counterBtn}>+</Text>
                     </Pressable>
                  </View>

                  <Pressable style={styles.confirmBtn} onPress={confirmSlot}>
                     <Text style={styles.confirmText}>CONFIRM</Text>
                  </Pressable>

                  {activeSlot && selectedSlots[activeSlot.key] && (
                     <Pressable onPress={removeSlot}>
                        <Text style={styles.removeText}>REMOVE</Text>
                     </Pressable>
                  )}
               </View>
            </View>
         </Modal>

         {/* PAYMENT MODAL */}
         <Modal transparent visible={paymentModal}>
            <View style={styles.modalBg}>
               <View style={styles.modal}>
                  <Pressable
                     style={styles.closeBtn}
                     onPress={() => setPaymentModal(false)}
                  >
                     <Text style={styles.closeText}>✕</Text>
                  </Pressable>

                  <Text style={styles.modalTitle}>
                     Please pay amount {totalAmount} HKD
                  </Text>

                  <Image
                     source={require("../../assets/images/qr.jpeg")}
                     style={{ width: 160, height: 160 }}
                  />

                  {!isTodayBooking && (
                     <Pressable style={styles.uploadBtn} onPress={pickImage}>
                        <Text style={styles.uploadText}>
                           Upload Payment Screenshot
                        </Text>
                     </Pressable>
                  )}

                  <Pressable style={styles.confirmBtn} onPress={confirmPayment}>
                     <Text style={styles.confirmText}>CONFIRM</Text>
                  </Pressable>
               </View>
            </View>
         </Modal>
      </SafeAreaView>
   )
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: "#111", marginBottom: 80 },
   header: { padding: 16, backgroundColor: "#1c1c1c" },
   headerTitle: { color: "#FF6D00", fontWeight: "700", fontSize: 16 },
   gridWrapper: { flexDirection: "row" },
   timeColumn: { width: TIME_COL_WIDTH },
   timeCell: { height: CELL_HEIGHT, justifyContent: "center", alignItems: "center" },
   timeText: { color: "#aaa", fontSize: 11 },
   dayHeaderRow: { flexDirection: "row", height: CELL_HEIGHT },
   dayCell: { width: CELL_WIDTH, alignItems: "center", backgroundColor: "#222", paddingVertical: 6 },
   dayText: { color: "#aaa", fontSize: 12 },
   dateText: { color: "#fff", fontWeight: "700" },
   monthGap: { width: 10 },
   slotRow: { flexDirection: "row" },
   slot: { width: CELL_WIDTH, height: CELL_HEIGHT, borderWidth: 0.5, borderColor: "#333", justifyContent: "center", alignItems: "center", backgroundColor: "#2b2b2b" },
   slotSelected: { backgroundColor: "#FF6D00" },
   slotFull: { backgroundColor: "red" },
   slotPast: { backgroundColor: "#555", opacity: 0.6 },
   slotText: { color: "#fff", fontSize: 11 },
   footer: { backgroundColor: "#FF6D00", padding: 14, flexDirection: "row", justifyContent: "space-between" },
   footerText: { fontWeight: "700" },
   bookBtn: { backgroundColor: "#000", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
   bookText: { color: "#FF6D00", fontWeight: "700" },
   modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
   modal: { width: 260, backgroundColor: "#222", padding: 20, borderRadius: 8, alignItems: "center" },
   modalTitle: { color: "#fff", marginBottom: 16 },
   counter: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
   counterBtn: { color: "#FF6D00", fontSize: 24, paddingHorizontal: 20 },
   counterVal: { color: "#fff", fontSize: 18 },
   confirmBtn: { backgroundColor: "#FF6D00", padding: 10, borderRadius: 6, width: "100%", alignItems: "center", marginTop: 8 },
   confirmText: { fontWeight: "700" },
   removeText: { color: "red", marginTop: 8 },
   uploadBtn: { marginVertical: 12 },
   uploadText: { color: "#FF6D00" },
   closeBtn: { position: "absolute", top: 10, right: 10 },
   closeText: { color: "#aaa", fontSize: 18, fontWeight: "700" },
})
