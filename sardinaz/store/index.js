import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import podReducer from './podSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pods: podReducer,
    booking: bookingReducer,
  },
});
