import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EditProfileScreen = () => {
  const { user } = useAuthStore();
  const {
    children: profileChildren,
    selectedChildId,
    isLoading,
    // You may want to add an updateChild action to your store for real DB update
  } = useProfileStore();

  // Find the child to edit (by selectedChildId or by param)
  const params = useLocalSearchParams();
  const childId = (params.childId as string) || selectedChildId;
  const child = profileChildren.find((c) => c.id === childId);

  // Local state for form fields
  const [name, setName] = useState(child?.name || "");
  const [age, setAge] = useState(child?.age?.toString() || "");
  const [avatar, setAvatar] = useState(child?.avatar || "");
  const [color, setColor] = useState(child?.color || "#3B82F6");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If child changes (e.g. after navigation), update form fields
    setName(child?.name || "");
    setAge(child?.age?.toString() || "");
    setAvatar(child?.avatar || "");
    setColor(child?.color || "#3B82F6");
  }, [childId]);

  // You need to implement this in your profileStore for DB update
  const { updateChild } = useProfileStore();

  const handleSubmit = async () => {
    setError(null);
    if (!childId) {
      setError("No child selected.");
      return;
    }
    if (!name.trim() || !age.trim() || !avatar.trim() || !color.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 0) {
      setError("Please enter a valid age.");
      return;
    }
    try {
      await updateChild(childId, {
        name: name.trim(),
        age: ageNum,
        avatar: avatar.trim(),
        color: color.trim(),
      });
      router.replace("/(screens)/profile");
    } catch (e: any) {
      setError(e.message || "Failed to update child.");
    }
  };

  if (!child) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{i18n.t("profile.child_not_found")}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>{i18n.t("common.back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>{i18n.t("profile.edit_profile")}</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          style={styles.input}
          placeholder={i18n.t("profile.name")}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("profile.age")}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("profile.avatar")}
          value={avatar}
          onChangeText={setAvatar}
          maxLength={2}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("profile.color")}
          value={color}
          onChangeText={setColor}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading
              ? i18n.t("profile.saving")
              : i18n.t("profile.save_changes")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>{i18n.t("common.cancel")}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: Colors.text.primary,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral.medium,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: Colors.background.secondary,
    color: Colors.text.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.neutral.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    alignItems: "center",
    padding: 8,
  },
  cancelButtonText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  error: {
    color: Colors.status.error,
    marginBottom: 12,
    textAlign: "center",
  },
});

export default EditProfileScreen;
