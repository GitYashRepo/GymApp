import { configureStore } from "@reduxjs/toolkit"
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"

import authReducer from "./authSlice"
import podReducer from "./podSlice"
import bookingReducer from "./bookingSlice"

const persistConfig = {
  key: "auth",
  storage: AsyncStorage,
}

const persistedAuth = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuth,
    pods: podReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
