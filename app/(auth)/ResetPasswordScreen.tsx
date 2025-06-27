import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";
import { useAuthStore } from "@/stores/authStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ResetPasswordScreen = () => {
  const { resetPassword, isLoading, error, mode, emailForVerification } =
    useAuthStore();
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email.trim()) {
      return;
    }
    await resetPassword(email);
  };

  const handleBackToLogin = () => {
    router.replace("/(auth)/LoginScreen");
  };

  // Show confirmation screen if reset email was sent
  if (mode === "reset" && emailForVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationIcon}>
            <Feather name="mail" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.confirmationTitle}>
            {i18n.t("resetPassword.check_your_email")}
          </Text>
          <Text style={styles.confirmationText}>
            {i18n.t("resetPassword.confirmation_text", {
              emailForVerification,
            })}
          </Text>
          <Button
            title={i18n.t("resetPassword.back_to_login")}
            onPress={handleBackToLogin}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

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
              onPress={handleBackToLogin}
            >
              <Feather
                name="arrow-left"
                size={24}
                color={Colors.neutral.darkGray}
              />
            </TouchableOpacity>
            <Text style={styles.title}>
              {i18n.t("resetPassword.reset_password")}
            </Text>
            <Text style={styles.subtitle}>
              {i18n.t("resetPassword.enter_email_address")}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label={i18n.t("resetPassword.email")}
              placeholder={i18n.t("resetPassword.placeholder_email")}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon="mail"
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title={i18n.t("resetPassword.send_reset_link")}
              onPress={handleResetPassword}
              isLoading={isLoading}
              style={styles.resetButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {i18n.t("resetPassword.remember_password")}?{" "}
              <Text style={styles.signInText} onPress={handleBackToLogin}>
                {i18n.t("resetPassword.sign_in")}
              </Text>
            </Text>
          </View>
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
  formContainer: {
    flex: 1,
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

export default ResetPasswordScreen;
