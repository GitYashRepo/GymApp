import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://YOUR_BACKEND_IP:5000/api';

export const fetchPods = createAsyncThunk(
  'pods/fetch',
  async () => {
    const res = await axios.get(`${API}/pods/home`);
    return res.data.data;
  }
);

const podSlice = createSlice({
  name: 'pods',
  initialState: {
    list: [],
    loading: false,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPods.pending, s => { s.loading = true })
      .addCase(fetchPods.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      });
  }
});

export default podSlice.reducer;
