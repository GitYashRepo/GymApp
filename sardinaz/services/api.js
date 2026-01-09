import axios from "axios"
import { getAuthToken } from "./token"

const api = axios.create({
  baseURL: process.env.EXPO_PRIVATE_API_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config
})

export default api
