import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

interface AppHeaderProps {
  title?: string;
  style?: ViewStyle;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title = "ClubHub", style }) => {
  return (
    <View style={[styles.header, style]}>
      <Text style={styles.logo}>{title}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push("/(screens)/notifications")}
        >
          <Feather name="bell" size={24} color={Colors.neutral.darkest} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push("/(screens)/profile")}
        >
          <Feather name="menu" size={24} color={Colors.neutral.darkest} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.neutral.darkest,
  },
  notificationButton: {
    padding: 4,
  },
});

export default AppHeader;
