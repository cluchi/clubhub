import ProfileSwitcher from "@/components/ProfileSwitcher";
import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/stores/authStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { children } from "@/mocks/users";
import i18n from "@/i18n";
import { useProfileStore } from "@/stores/profileStore";

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut, isLoading } = useAuthStore();
  const {
    fetchChildren,
    children: profileChildren,
    selectedChildId,
    selectChild,
  } = useProfileStore();

  const handleBack = () => {
    router.replace("/(tabs)/home");
  };

  const handleLogout = () => {
    Alert.alert(
      i18n.t("common.logout") || "Logout",
      i18n.t("profile.logout_confirm") || "Are you sure you want to logout?",
      [
        {
          text: i18n.t("common.cancel") || "Cancel",
          style: "cancel",
        },
        {
          text: i18n.t("common.logout") || "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled by the auth store's auth state listener
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert(
                "Error",
                "An error occurred while logging out. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const onAddChild = () => {
    router.push("/(screens)/AddProfileScreen");
  };

  useEffect(() => {
    if (user?.id) {
      fetchChildren(user.id);
    } else {
      Alert.alert("Error", "No user found. Please sign in.");
      router.replace("/(auth)/LoginScreen");
    }
  }, [user, fetchChildren]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButtonHeader}
              onPress={handleBack}
            >
              <Feather
                name="arrow-left"
                size={24}
                color={Colors.neutral.darkGray}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{i18n.t("profile.profile_page")}</Text>
            <Text style={styles.subtitle}>
              {i18n.t("profile.greeting", {
                name: user?.name || i18n.t("profile.guest"),
              })}
            </Text>
            <TouchableOpacity
              style={styles.logoutButtonHeader}
              onPress={handleLogout}
              disabled={isLoading}
            >
              <Feather
                name="log-out"
                size={24}
                color={Colors.neutral.darkGray}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.profileContainer]}>
            <ProfileSwitcher
              selectedChildId={selectedChildId || ""}
              onSelectChild={selectChild}
              onAddChild={onAddChild}
            >
              {profileChildren}
            </ProfileSwitcher>
          </View>
          {selectedChildId && (
            <View style={{ marginLeft: 16, justifyContent: "center" }}>
              {(() => {
                const selectedChild = profileChildren.find(
                  (child) => child.id === selectedChildId,
                );
                if (!selectedChild) return null;
                return (
                  <>
                    <View>
                      <Text
                        style={{
                          color: Colors.neutral.dark,
                          fontWeight: "bold",
                          fontSize: 16,
                          marginBottom: 4,
                        }}
                      >
                        {i18n.t("profile.name")}: {selectedChild?.name}
                      </Text>
                      <Text
                        style={{
                          color: Colors.neutral.dark,
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        {i18n.t("profile.age")}: {selectedChild?.age}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{ marginLeft: 12, padding: 6 }}
                      onPress={() =>
                        router.push({
                          pathname: "/(screens)/EditProfileScreen",
                          params: { childId: selectedChildId },
                        })
                      }
                    >
                      <Feather name="edit" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginLeft: 12, padding: 6 }}
                      onPress={async () => {
                        Alert.alert(
                          i18n.t("profile.delete_profile") || "Delete Profile",
                          i18n.t("profile.delete_confirm") ||
                            "Are you sure you want to delete this profile?",
                          [
                            {
                              text: i18n.t("common.cancel") || "Cancel",
                              style: "cancel",
                            },
                            {
                              text: i18n.t("common.delete") || "Delete",
                              style: "destructive",
                              onPress: async () => {
                                await useProfileStore
                                  .getState()
                                  .removeChild(selectedChildId);
                              },
                            },
                          ],
                        );
                      }}
                    >
                      <Feather name="delete" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                  </>
                );
              })()}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 48,
    alignItems: "center",
  },
  backButtonHeader: {
    position: "absolute",
    left: 0,
    top: 20,
    padding: 8,
  },
  logoutButtonHeader: {
    position: "absolute",
    right: 0,
    top: 20,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  profileContainer: {
    alignSelf: "stretch",
  },
  errorText: {
    color: Colors.status.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  resetButton: {
    marginBottom: 32,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  signInText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  // Confirmation screen styles
  confirmationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  confirmationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  confirmationText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  backButton: {
    minWidth: 200,
  },
});

export default ProfileScreen;
