import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../services/api"

export const fetchHomePods = createAsyncThunk(
  "pods/fetchHome",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/pods/home")
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message)
    }
  }
)

export const createGymPod = createAsyncThunk(
  "pods/create",
  async (podData, thunkAPI) => {
    try {
      const res = await api.post("/pods", podData)
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message)
    }
  }
)

const podSlice = createSlice({
  name: "pods",
  initialState: {
    pods: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePods.fulfilled, (state, action) => {
        state.pods = action.payload
      })
  },
})

export default podSlice.reducer
