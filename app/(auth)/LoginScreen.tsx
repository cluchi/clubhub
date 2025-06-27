import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  const { user } = useAuthStore();

  const { signIn, signUp, mode, setMode, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Watch for user state change and navigate
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/home");
    }
  }, [user]);

  const handleSignIn = async () => {
    if (email && password) {
      await signIn(email, password);
    }
  };

  const handleSignUp = () => {
    setMode("signup");
    router.replace("/(auth)/SignUpScreen");
  };

  const handleForgotPassword = () => {
    setMode("reset");
    router.replace("/(auth)/ResetPasswordScreen");
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{i18n.t("common.club_hub")}</Text>
          <Text style={styles.subtitle}>{i18n.t("common.discover")}</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label={i18n.t("login.email")}
            placeholder={i18n.t("login.placeholder_email")}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            leftIcon="mail"
          />

          <Input
            label={i18n.t("login.password")}
            placeholder={i18n.t("login.placeholder_password")}
            isPassword
            value={password}
            onChangeText={setPassword}
            leftIcon="lock"
          />

          <View style={styles.rememberContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>
                {i18n.t("login.remember_me")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>
                {i18n.t("login.forgot_password")}?
              </Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title={i18n.t("login.sign_in")}
            onPress={handleSignIn}
            isLoading={isLoading}
            style={styles.signInButton}
          />

          {/* <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Google")}
            >
              <Text style={styles.socialButtonText}>
                <Text style={styles.socialIcon}>G</Text> Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Apple")}
            >
              <Text style={styles.socialButtonText}>
                <Text style={styles.socialIcon}>⌘</Text> Continue with Apple
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>{i18n.t("login.why_join")}?</Text>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: "#E0F2F1" }]}>
              <Text style={[styles.benefitIconText, { color: Colors.primary }]}>
                📍
              </Text>
            </View>
            <Text style={styles.benefitText}>{i18n.t("login.find_clubs")}</Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: "#E8EAF6" }]}>
              <Text
                style={[
                  styles.benefitIconText,
                  { color: Colors.secondary.blue },
                ]}
              >
                📅
              </Text>
            </View>
            <Text style={styles.benefitText}>
              {i18n.t("login.book_instantly")}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {i18n.t("login.no_account")}
            <Text style={styles.signUpText} onPress={handleSignUp}>
              {i18n.t("login.sign_up")}
            </Text>
          </Text>

          <View style={styles.termsContainer}>
            <TouchableOpacity>
              <Text style={styles.termsText}>
                {i18n.t("common.terms_of_service")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.termsText}>
                {i18n.t("common.privacy_policy")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.neutral.darkest,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.neutral.dark,
  },
  formContainer: {
    marginBottom: 32,
  },
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.neutral.medium,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.neutral.white,
    fontSize: 12,
  },
  rememberText: {
    color: Colors.neutral.dark,
  },
  forgotText: {
    color: Colors.primary,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  signInButton: {
    marginBottom: 16,
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.neutral.medium,
    borderRadius: 8,
  },
  socialIcon: {
    fontWeight: "bold",
  },
  socialButtonText: {
    color: Colors.neutral.darkest,
    fontWeight: "500",
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.neutral.darkest,
    marginBottom: 16,
    textAlign: "center",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  benefitIconText: {
    fontSize: 18,
  },
  benefitText: {
    fontSize: 16,
    color: Colors.neutral.dark,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: Colors.neutral.dark,
    marginBottom: 16,
  },
  signUpText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  termsContainer: {
    flexDirection: "row",
    gap: 24,
  },
  termsText: {
    color: Colors.neutral.darkGray,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
