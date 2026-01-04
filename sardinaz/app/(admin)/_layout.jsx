import { Stack, Redirect } from "expo-router"
import { useSelector } from "react-redux"

export default function AdminLayout() {
   const { user } = useSelector(state => state.auth)

   if (!user || user.role !== "admin") {
      return <Redirect href="/(auth)/login" />
   }

   return <Stack screenOptions={{ headerShown: false }} />
}
