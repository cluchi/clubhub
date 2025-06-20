import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import ProfileSwitcher from "@/components/ProfileSwitcher";
// import { children } from "@/mocks/users";
import { useProfileStore } from "@/stores/profileStore";

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const {
    fetchChildren,
    children: profileChildren,
    // selectedChildId,
  } = useProfileStore();

  const [selectedChildId, setSelectedChildId] = useState(
    profileChildren[0]?.id || ""
  );

  const handleBack = () => {
    router.replace("/(tabs)/home");
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
            <Text style={styles.title}>Profile Page</Text>
            <Text style={styles.subtitle}>
              Welcome, {user?.name || "Guest"}!
            </Text>
          </View>

          <View style={[styles.profileContainer]}>
            <ProfileSwitcher
              selectedChildId={selectedChildId || ""}
              onSelectChild={setSelectedChildId}
              onAddChild={onAddChild}
            >
              {profileChildren}
            </ProfileSwitcher>
          </View>
          {selectedChildId && (
            <View style={{ marginLeft: 16, justifyContent: "center" }}>
              {(() => {
                const selectedChild = profileChildren.find(
                  (child) => child.id === selectedChildId
                );
                if (!selectedChild) return null;
                return (
                  <View>
                    <Text
                      style={{
                        color: Colors.neutral.dark,
                        fontWeight: "bold",
                        fontSize: 16,
                        marginBottom: 4,
                      }}
                    >
                      Name: {selectedChild?.name}
                    </Text>
                    <Text
                      style={{
                        color: Colors.neutral.dark,
                        fontWeight: "bold",
                        fontSize: 14,
                      }}
                    >
                      Age: {selectedChild?.age}
                    </Text>
                  </View>
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
