import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const createGymPod = createAsyncThunk(
  "pods/createGymPod",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/pods/create-pods", payload);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create pod"
      );
    }
  }
);


export const fetchHomePods = createAsyncThunk(
  "pods/fetchHome",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/pods/get-pods");

      console.log("🔥 BACKEND RESPONSE:", res.data); // DEBUG

      // ✅ handle ALL possible backend shapes
      return res.data.data || res.data.pods || [];
    } catch (err) {
      console.log("❌ FETCH PODS ERROR:", err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const podSlice = createSlice({
  name: "pods",
  initialState: {
    pods: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePods.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomePods.fulfilled, (state, action) => {
        state.loading = false;
        state.pods = action.payload;
      })
      .addCase(fetchHomePods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default podSlice.reducer;
