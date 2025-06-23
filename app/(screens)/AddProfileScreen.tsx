import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddProfileScreen = () => {
  const { addChild, isLoading, error: addChildError } = useProfileStore();
  const { user } = useAuthStore();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim() || !age.trim() || !avatar.trim() || !color.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!user?.id) {
      setError("No parent user found.");
      return;
    }
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 0) {
      setError("Please enter a valid age.");
      return;
    }
    try {
      await addChild(user.id, {
        name: name.trim(),
        age: ageNum,
        avatar: avatar.trim(),
        color: color.trim(),
      });
      console.log("addChildError", addChildError);
      router.replace("/(screens)/profile");
      //   router.back();
    } catch (e: any) {
      setError(e.message || "Failed to add child.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>{i18n.t("profile.add_new_profile")}</Text>
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
              ? i18n.t("profile.adding")
              : i18n.t("profile.add_profile")}
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

export default AddProfileScreen;
