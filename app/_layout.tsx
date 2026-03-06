import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuthStore } from "@/stores/authStore";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useState } from "react";
// import AuthRedirectHandler from "@/screens/AuthRedirectHandler";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { user, isLoading, initializeAuth } = useAuthStore();
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Initialize Supabase auth state listener
    const initAuth = async () => {
      if (initializeAuth) {
        await initializeAuth();
        setAuthInitialized(true);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    // Log the user state whenever it changes
    console.log("User state changed:", user, "isLoading:", isLoading);
  }, [user, isLoading]);

  // Show loading screen while fonts are loading
  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Show loading screen while auth is initializing
  if (!authInitialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Now we have auth initialized, render appropriate screens
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
