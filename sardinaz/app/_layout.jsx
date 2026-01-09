import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from '../store';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from "react"
import * as Notifications from "expo-notifications"
import { useColorScheme } from '../hooks/use-color-scheme';
import { registerForPushNotificationsAsync } from '../utils/notifications';


Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
   }),
})




export const unstable_settings = {
   anchor: '(tabs)',
};

export default function RootLayout() {
   const colorScheme = useColorScheme();

   useEffect(() => {
      registerForPushNotificationsAsync()
   }, [])


   return (
      <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
               <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                  <Stack.Screen
                     name="modal"
                     options={{ presentation: 'modal', title: 'Modal' }}
                  />
               </Stack>
               <StatusBar style="auto" />
            </ThemeProvider>
         </PersistGate>
      </Provider>
   );
}
