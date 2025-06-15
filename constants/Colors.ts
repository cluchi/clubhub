/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
  primary: "#14B8A6", // Teal
  secondary: {
    blue: "#3B82F6",
    purple: "#8B5CF6",
    orange: "#F97316",
  },
  neutral: {
    white: "#FFFFFF",
    lightest: "#F9FAFB",
    light: "#F3F4F6",
    lightGray: "#E5E7EB",
    medium: "#E5E7EB",
    gray: "#9CA3AF",
    darkGray: "#6B7280",
    dark: "#374151",
    darkest: "#111827",
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
  },
  text: {
    primary: "#111827",
    secondary: "#6B7280",
  },
  status: {
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  },
};

export const STORAGE_KEYS = {
  AUTH_STORE: "33cdc89b-5ae5-4278-a7f7-dfc3fe97da47-auth-store",
};
