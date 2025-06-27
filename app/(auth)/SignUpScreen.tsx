import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";
import { useAuthStore } from "@/stores/authStore";
import { Feather } from "@expo/vector-icons";
import { Provider } from "@supabase/auth-js";
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

const SignUpScreen = () => {
  const { signUp, isLoading, error, mode } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return i18n.t("signUp.validation_full_name");
    }
    if (!formData.email.trim()) {
      return i18n.t("signUp.validation_email_address");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return i18n.t("signUp.validation_valid_email_address");
    }
    if (formData.password.length < 6) {
      return i18n.t("signUp.validation_characters_long");
    }
    if (formData.password !== formData.confirmPassword) {
      return i18n.t("signUp.validation_passwords_do_not_match");
    }
    if (!acceptTerms) {
      return i18n.t("signUp.validation_terms_of_service");
    }
    return null;
  };

  const handleSignUp = async () => {
    const validationError = validateForm();
    if (validationError) {
      // You could show this error in a toast or set it in the store
      console.log("Validation error:", validationError);
      return;
    }

    await signUp(formData.email, formData.password, formData.name);
  };

  const handleBackToLogin = () => {
    router.replace("/(auth)/LoginScreen");
  };

  const handleSocialSignUp = async (provider: Provider) => {
    // In a real app, this would integrate with Expo Auth Session
    console.log(`TODO Sign up with ${provider}`);
  };

  // Show email verification screen if signup was successful
  if (mode === "verify-email") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.verificationContainer}>
          <View style={styles.verificationIcon}>
            <Feather name="mail" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.verificationTitle}>
            {i18n.t("signUp.check_your_email")}
          </Text>
          <Text style={styles.verificationText}>
            {i18n.t("signUp.verification_link", { email: formData.email })}
          </Text>
          <Button
            title={i18n.t("signUp.back_to_login")}
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
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <Feather
                name="arrow-left"
                size={24}
                color={Colors.neutral.darkGray}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{i18n.t("create_account")}</Text>
            <Text style={styles.subtitle}>{i18n.t("signUp.join_clubHub")}</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label={i18n.t("signUp.full_name")}
              placeholder={i18n.t("signUp.placeholder_full_name")}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              leftIcon="user"
              autoCapitalize="words"
            />

            <Input
              label={i18n.t("signUp.email")}
              placeholder={i18n.t("signUp.placeholder_email")}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              leftIcon="mail"
            />

            <Input
              label={i18n.t("signUp.password")}
              placeholder={i18n.t("signUp.placeholder_password")}
              isPassword={!showPassword}
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              leftIcon="lock"
              rightIcon={showPassword ? "eye-off" : "eye"}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Input
              label={i18n.t("signUp.confirm_password")}
              placeholder={i18n.t("signUp.placeholder_confirm_password")}
              isPassword={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              leftIcon="lock"
              rightIcon={showConfirmPassword ? "eye-off" : "eye"}
              onRightIconPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View
                  style={[
                    styles.checkbox,
                    acceptTerms && styles.checkboxChecked,
                  ]}
                >
                  {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  {i18n.t("common.agree_to")}{" "}
                  <Text style={styles.linkText}>
                    {" "}
                    {i18n.t("common.terms_of_service")}
                  </Text>{" "}
                  and{" "}
                  <Text style={styles.linkText}>
                    {" "}
                    {i18n.t("common.privacy_policy")}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title={i18n.t("signUp.create_account")}
              onPress={handleSignUp}
              isLoading={isLoading}
              style={styles.signUpButton}
            />

            {/* <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View> */}

            {/* <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignUp("google")}
              >
                <Text style={styles.socialButtonText}>
                  <Text style={styles.socialIcon}>G</Text> Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignUp("apple")}
              >
                <Text style={styles.socialButtonText}>
                  <Text style={styles.socialIcon}>⌘</Text> Continue with Apple
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {i18n.t("signUp.already_an_account")}{" "}
              <Text style={styles.signInText} onPress={handleBackToLogin}>
                {i18n.t("signUp.sign_in")}
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
    paddingBottom: 32,
    alignItems: "center",
  },
  backButton: {
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
  },
  formContainer: {
    flex: 1,
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.neutral.lightGray,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.background.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    flex: 1,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  errorText: {
    color: Colors.status.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  signUpButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral.lightGray,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  socialContainer: {
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.neutral.lightGray,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  socialIcon: {
    fontSize: 18,
    marginRight: 8,
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
  // Email verification styles
  verificationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  verificationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  verificationText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
});

export default SignUpScreen;
