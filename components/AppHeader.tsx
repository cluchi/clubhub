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
import { useProfileStore } from "@/stores/profileStore";

interface AppHeaderProps {
  title?: string;
  style?: ViewStyle;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title = "ClubHub", style }) => {
  const { children, selectedChildId } = useProfileStore();

  const selectedChild = children.find((child) => child.id === selectedChildId);

  const renderAvatar = () => {
    if (!selectedChild) {
      return (
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => router.push("/(screens)/profile")}
        >
          <View style={[styles.avatarContainer, styles.defaultAvatar]}>
            <Feather name="user" size={20} color={Colors.neutral.white} />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={() => router.push("/(screens)/profile")}
      >
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: selectedChild.color },
          ]}
        >
          <Text style={styles.avatarText}>{selectedChild.avatar}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        {renderAvatar()}
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
  avatarButton: {
    padding: 4,
    marginLeft: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  defaultAvatar: {
    backgroundColor: Colors.neutral.medium,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.white,
  },
});

export default AppHeader;
