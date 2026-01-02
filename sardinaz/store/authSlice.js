import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://YOUR_BACKEND_IP:5000/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data) => {
    const res = await axios.post(`${API}/users/login`, data);
    return res.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, s => { s.loading = true })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
