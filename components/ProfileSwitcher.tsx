import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Child } from "@/mocks/users";

interface ProfileSwitcherProps {
  children: Child[];
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
  onAddChild?: () => void;
}

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  children,
  selectedChildId,
  onSelectChild,
  onAddChild,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {children.map((child) => (
        <TouchableOpacity
          key={child.id}
          style={[
            styles.profileButton,
            {
              backgroundColor:
                child.id === selectedChildId ? child.color : "transparent",
            },
            child.id === selectedChildId ? null : styles.inactiveButton,
          ]}
          onPress={() => onSelectChild(child.id)}
        >
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor:
                  child.id === selectedChildId
                    ? Colors.neutral.white
                    : child.color,
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                {
                  color:
                    child.id === selectedChildId
                      ? child.color
                      : Colors.neutral.white,
                },
              ]}
            >
              {child.avatar}
            </Text>
          </View>
          {child.id === selectedChildId && (
            <Text style={styles.name}>{child.name}</Text>
          )}
        </TouchableOpacity>
      ))}
      {!children.length && (
        <View style={[styles.profileAddContainer]}>
          <Text style={[styles.avatarText]}>Add Profile</Text>
        </View>
      )}
      {onAddChild && (
        <TouchableOpacity
          style={[styles.profileButton, styles.addButton]}
          onPress={onAddChild}
        >
          <View style={styles.addIconContainer}>
            <Text style={styles.addIcon}>+</Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 12,
  },
  inactiveButton: {
    borderWidth: 1,
    borderColor: Colors.neutral.light,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
  },
  profileAddContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 12,
  },
  name: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.neutral.white,
  },
  addButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.neutral.medium,
  },
  addIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.neutral.medium,
  },
  addIcon: {
    fontSize: 20,
    color: Colors.neutral.darkGray,
  },
});

export default ProfileSwitcher;
