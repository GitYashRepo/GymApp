import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../services/api"
import { setAuthToken } from "../services/token"

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/users/login", credentials)
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message)
    }
  }
)

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/admin/login", credentials)
      return {
        token: res.data.token,
        user: { ...res.data.admin, role: "admin" },
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message)
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
  state.token = action.payload.token
  state.user = action.payload.user
  setAuthToken(action.payload.token)
})
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
  state.token = action.payload.token
  state.user = action.payload.user
  setAuthToken(action.payload.token)
})
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
