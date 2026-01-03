import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../services/api"

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, thunkAPI) => {
    try {
      const res = await api.post("/bookings", bookingData)
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message)
    }
  }
)

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder.addCase(createBooking.fulfilled, (state, action) => {
      state.bookings.push(action.payload)
    })
  },
})

export default bookingSlice.reducer
