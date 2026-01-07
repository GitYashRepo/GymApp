import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

/* ================= CREATE POD ================= */
export const createGymPod = createAsyncThunk(
  "pods/createGymPod",
  async (formData, thunkAPI) => {
    try {
      // 🔐 SAFETY CHECK (CRITICAL)
      if (!(formData instanceof FormData)) {
        throw new Error("createGymPod expects FormData");
      }

      const res = await api.post("/pods/create-pods", formData);

      return res.data.data;
    } catch (err) {
      console.error(
        "❌ CREATE POD ERROR:",
        err.response?.data || err.message
      );

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create pod"
      );
    }
  }
);

/* ================= FETCH HOME PODS ================= */
export const fetchHomePods = createAsyncThunk(
  "pods/fetchHomePods",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/pods/get-pods");
      return res.data.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch pods"
      );
    }
  }
);

/* ================= FETCH ADMIN PODS ================= */
export const fetchAdminPods = createAsyncThunk(
  "pods/fetchAdminPods",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/pods/admin-pods");
      return res.data.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch admin pods"
      );
    }
  }
);

/* ================= UPDATE POD ================= */
export const updateGymPod = createAsyncThunk(
  "pods/updateGymPod",
  async ({ id, data }, thunkAPI) => {
    try {
      if (!(data instanceof FormData)) {
        throw new Error("updateGymPod expects FormData");
      }

      const res = await api.put(`/pods/${id}`, data);
      return res.data.data;
    } catch (err) {
      console.error(
        "❌ UPDATE POD ERROR:",
        err.response?.data || err.message
      );

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update pod"
      );
    }
  }
);

/* ================= DELETE POD ================= */
export const deletePod = createAsyncThunk(
  "pods/deletePod",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/pods/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete pod"
      );
    }
  }
);

/* ================= SLICE ================= */
const podSlice = createSlice({
  name: "pods",
  initialState: {
    pods: [],        // user home pods
    adminPods: [],   // admin-created pods
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* -------- CREATE -------- */
      .addCase(createGymPod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGymPod.fulfilled, (state, action) => {
        state.loading = false;
        state.adminPods.unshift(action.payload);
      })
      .addCase(createGymPod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- HOME PODS -------- */
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
      })

      /* -------- ADMIN PODS -------- */
      .addCase(fetchAdminPods.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminPods.fulfilled, (state, action) => {
        state.loading = false;
        state.adminPods = action.payload;
      })
      .addCase(fetchAdminPods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- UPDATE -------- */
      .addCase(updateGymPod.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGymPod.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.adminPods.findIndex(
          (pod) => pod._id === action.payload._id
        );

        if (index !== -1) {
          state.adminPods[index] = action.payload;
        }
      })
      .addCase(updateGymPod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- DELETE -------- */
      .addCase(deletePod.fulfilled, (state, action) => {
        state.adminPods = state.adminPods.filter(
          (pod) => pod._id !== action.payload
        );
      });
  },
});

export default podSlice.reducer;
