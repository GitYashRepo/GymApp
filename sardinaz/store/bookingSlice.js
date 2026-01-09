import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Platform } from "react-native"
import api from "../services/api"

/* ================= CREATE MULTI SLOT BOOKING ================= */

export const createMultiSlotBooking = createAsyncThunk(
  "booking/createMultiSlotBooking",
  async ({ bookingData, paymentImage }, thunkAPI) => {
    try {
      // ✅ STEP 1: CREATE BOOKING
      const res = await api.post("/bookings/multi", bookingData);
      const booking = res.data.data;

      // ✅ STEP 2: UPLOAD PAYMENT ONLY FOR FUTURE DAY
      if (booking.bookingType === "future_day" && paymentImage) {
        const formData = new FormData();

        formData.append("payment", {
          uri: paymentImage.uri,
          name: "payment.jpg",
          type: "image/jpeg",
        });

        await api.patch(
          `/bookings/${booking._id}/upload-payment`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      // ✅ IMPORTANT: RETURN BOOKING NO MATTER WHAT
      return booking;

    } catch (err) {
      console.log("BOOKING THUNK ERROR:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Booking failed"
      );
    }
  }
);




/* ================= FETCH MY BOOKINGS ================= */

export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/bookings/my")
      return res.data.data
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch bookings")
    }
  }
)


/* ================= SLICE ================= */

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBookingState: (state) => {
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMultiSlotBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createMultiSlotBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings.unshift(action.payload)
      })
      .addCase(createMultiSlotBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMyBookings.pending, (state) => {
  state.loading = true
  state.error = null
})
.addCase(fetchMyBookings.fulfilled, (state, action) => {
  state.loading = false
  state.bookings = action.payload
})
.addCase(fetchMyBookings.rejected, (state, action) => {
  state.loading = false
  state.error = action.payload
})
  },
})

export const { clearBookingState } = bookingSlice.actions
export default bookingSlice.reducer
