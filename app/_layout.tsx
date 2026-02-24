import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useAuthStore } from "@/stores/authStore";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { router } from "expo-router";
// import AuthRedirectHandler from "@/screens/AuthRedirectHandler";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize Supabase auth state listener
    const initAuth = async () => {
      if (initializeAuth) {
        await initializeAuth();
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    // Log the user state whenever it changes
    console.log("User state changed:", user);
  }, [user]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  if (!user) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(auth)/LoginScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(auth)/SignUpScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(auth)/ResetPasswordScreen"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(screens)/profile"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/AddProfileScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/EditProfileScreen"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(screens)/[clubId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
