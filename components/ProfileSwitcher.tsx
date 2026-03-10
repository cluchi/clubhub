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
  selectedChildId: string | null;
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
            // {
            //   backgroundColor:
            //     child.id === selectedChildId ? child.color : "transparent",
            // },
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
                borderColor:
                  child.id === selectedChildId ? Colors.primary : "transparent",
                borderWidth: child.id === selectedChildId ? 2 : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                {
                  color:
                    child.id === selectedChildId
                      ? Colors.primary
                      : Colors.neutral.white,
                },
              ]}
            >
              {child.avatar}
            </Text>
          </View>
          {/* {child.id === selectedChildId && ( */}
          <Text
            style={[
              styles.name,
              {
                color:
                  child.id === selectedChildId ? Colors.primary : child.color,
              },
            ]}
          >
            {child.name}
          </Text>
          {/* )} */}
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
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    minWidth: 70,
  },
  inactiveButton: {
    opacity: 0.6,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.neutral.white,
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "600",
  },
  profileAddContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 12,
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.primary,
  },
  addButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.neutral.medium,
  },
  addIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.neutral.white,
    marginBottom: 4,
  },
  addIcon: {
    fontSize: 32,
    color: Colors.neutral.darkGray,
  },
});

export default ProfileSwitcher;
