import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../libs/supabase";
// import type { User as SupabaseUser } from "@supabase/supabase-js";
import { STORAGE_KEYS } from "@/constants/Colors";

export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * AUTH SYSTEM GUIDE - Supabase Integration:
 *
 * 1. SIGNIN ('signin'):
 *    - Uses Supabase signInWithPassword
 *    - Handles email confirmation requirements
 *    - Real-time error handling with user-friendly messages
 *
 * 2. SIGNUP ('signup'):
 *    - Uses Supabase signUp with email confirmation
 *    - Automatically creates profile via database trigger
 *    - Switches to verify-email mode after successful signup
 *
 * 3. RESET PASSWORD ('reset'):
 *    - Uses Supabase resetPasswordForEmail
 *    - Listens for PASSWORD_RECOVERY auth state change
 *    - Shows reset form when recovery link is clicked
 *
 * 4. VERIFY EMAIL ('verify-email'):
 *    - Shows after signup or when email not confirmed
 *    - Resend verification with rate limiting
 *    - Listens for SIGNED_IN auth state change
 *
 * 5. AUTH STATE LISTENER:
 *    - Monitors onAuthStateChange for all auth events
 *    - Handles session management and user state updates
 *    - Manages password recovery flow in Expo environment
 */

export type AuthMode =
  | "signin"
  | "signup"
  | "reset"
  | "verify-email"
  | "confirm-email";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  mode: AuthMode;
  emailForVerification: string | null;
  isEmailVerified: boolean;
}

export interface AuthActions {
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;

  // State management
  setMode: (mode: AuthMode) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;

  // Initialization
  initializeAuth: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

// Common Supabase auth errors and their user-friendly messages
const getAuthErrorMessage = (error: any): string => {
  const message = error?.message || error || "An unexpected error occurred";

  // Supabase specific errors
  if (message.includes("Invalid login credentials")) {
    return "Invalid email or password. Please check your credentials.";
  }
  if (message.includes("Email not confirmed")) {
    return "Please verify your email address before signing in.";
  }
  if (message.includes("User already registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (message.includes("Password should be at least")) {
    return "Password must be at least 6 characters long.";
  }
  if (message.includes("Unable to validate email address")) {
    return "Please enter a valid email address.";
  }
  if (message.includes("Email rate limit exceeded")) {
    return "Too many emails sent. Please wait before requesting another.";
  }
  if (message.includes("Token has expired")) {
    return "Verification link has expired. Please request a new one.";
  }
  if (message.includes("Invalid token")) {
    return "Invalid verification link. Please request a new one.";
  }
  if (message.includes("Network request failed")) {
    return "Network error. Please check your connection and try again.";
  }

  return message;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,
      mode: "signin",
      emailForVerification: null,
      isEmailVerified: false,

      // Auth actions - Supabase implementation
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("🔐 Attempting sign in for:", email);

          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });

          if (error) {
            console.error("❌ Sign in error:", error);

            // Handle specific Supabase auth errors
            if (error.message.includes("Email not confirmed")) {
              set({
                isLoading: false,
                error: "Please verify your email address before signing in.",
                emailForVerification: email,
                mode: "verify-email",
              });
              return;
            }

            if (error.message.includes("Invalid login credentials")) {
              set({
                isLoading: false,
                error:
                  "Invalid email or password. Please check your credentials and try again.",
              });
              return;
            }

            set({ isLoading: false, error: getAuthErrorMessage(error) });
            return;
          }

          if (data.user) {
            console.log("✅ Sign in successful for user:", data.user.id);

            // Get user profile
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();

            if (profileError) {
              console.error("❌ Profile fetch error:", profileError);
              // Create profile if it doesn't exist
              const { error: insertError } = await supabase
                .from("profiles")
                .insert({
                  id: data.user.id,
                  email: data.user.email!,
                  name:
                    data.user.user_metadata?.name ||
                    data.user.email!.split("@")[0],
                });

              if (insertError) {
                console.error("❌ Profile creation error:", insertError);
              }
            }

            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              name:
                profile?.name ||
                data.user.user_metadata?.name ||
                data.user.email!.split("@")[0],
            };

            set({ user, isLoading: false, isEmailVerified: true, error: null });
          }
        } catch (error) {
          console.error("❌ Sign in exception:", error);
          set({ isLoading: false, error: getAuthErrorMessage(error) });
        }
      },

      signUp: async (email: string, password: string, name?: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("🔐 Attempting sign up for:", email);

          const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
              data: {
                name: name || email.split("@")[0],
              },
            },
          });

          if (error) {
            console.error("❌ Sign up error:", error);
            set({ isLoading: false, error: getAuthErrorMessage(error) });
            return;
          }

          if (data.user) {
            console.log(
              "✅ Sign up successful, verification email sent to:",
              email,
            );
            set({
              isLoading: false,
              emailForVerification: email,
              mode: "verify-email",
              error: null,
            });
          }
        } catch (error) {
          console.error("❌ Sign up exception:", error);
          set({ isLoading: false, error: getAuthErrorMessage(error) });
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          console.log("🔐 Attempting sign out");

          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error("❌ Sign out error:", error);
            set({ isLoading: false, error: getAuthErrorMessage(error) });
            return;
          }

          console.log("✅ Sign out successful");
          set({
            user: null,
            isLoading: false,
            error: null,
            mode: "signin",
            emailForVerification: null,
            isEmailVerified: false,
          });
        } catch (error) {
          console.error("❌ Sign out exception:", error);
          set({ isLoading: false, error: getAuthErrorMessage(error) });
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("🔐 Attempting password reset for:", email);

          const { error } = await supabase.auth.resetPasswordForEmail(
            email.trim().toLowerCase(),
            {
              redirectTo: "https://your-app.com/reset-password", // This won't work in Expo, but we handle it via auth state change
            },
          );

          if (error) {
            console.error("❌ Password reset error:", error);
            set({ isLoading: false, error: getAuthErrorMessage(error) });
            return;
          }

          console.log("✅ Password reset email sent to:", email);
          set({
            isLoading: false,
            error: null,
            emailForVerification: email,
            mode: "reset",
          });
        } catch (error) {
          console.error("❌ Password reset exception:", error);
          set({ isLoading: false, error: getAuthErrorMessage(error) });
        }
      },

      confirmEmail: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("🔐 Attempting email confirmation with token");

          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
          });

          if (error) {
            console.error("❌ Email confirmation error:", error);
            set({ isLoading: false, error: getAuthErrorMessage(error) });
            return;
          }

          if (data.user) {
            console.log("✅ Email confirmed successfully");
            set({
              isLoading: false,
              isEmailVerified: true,
              mode: "signin",
              error: null,
            });
          }
        } catch (error) {
          console.error("❌ Email confirmation exception:", error);
          set({ isLoading: false, error: getAuthErrorMessage(error) });
        }
      },

      resendVerification: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("🔐 Resending verification email to:", email);

          const { error } = await supabase.auth.resend({
            type: "signup",
            email: email.trim().toLowerCase(),
          });

          if (error) {
            console.error("❌ Resend verification error:", error);
            set({ isLoading: false, error: getAuthErrorMessage(error) });
            return;
          }

          console.log("✅ Verification email resent successfully");
          set({ isLoading: false, error: null });
        } catch (error) {
          console.error("❌ Resend verification exception:", error);
          set({ isLoading: false, error: getAuthErrorMessage(error) });
        }
      },

      // Initialize auth state listener
      initializeAuth: async () => {
        console.log("🔐 Initializing auth state listener");
        set({ isLoading: true, error: null });

        try {
          // Validate Supabase configuration first
          if (!supabase || !supabase.auth) {
            console.error("❌ Supabase not properly initialized");
            set({
              user: null,
              isEmailVerified: false,
              error: "Authentication service unavailable",
              isLoading: false,
            });
            return;
          }

          // Get initial session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error("❌ Error getting initial session:", error);
            // Clear any corrupted session data
            set({
              user: null,
              isEmailVerified: false,
              error: null,
              isLoading: false,
            });
            return;
          }

          if (session) {
            if (session.user && session.user.id) {
              // ✅ Valid session with user - proceed normally
              console.log(
                "✅ Found existing session for user:",
                session.user.id,
              );

              try {
                // Get user profile
                const { data: profile } = await supabase
                  .from("profiles")
                  .select("*")
                  .eq("id", session.user.id)
                  .single();

                const user: User = {
                  id: session.user.id,
                  email: session.user.email!,
                  name:
                    profile?.name ||
                    session.user.user_metadata?.name ||
                    session.user.email!.split("@")[0],
                };

                set({
                  user,
                  isEmailVerified: true,
                  error: null,
                  isLoading: false,
                });
              } catch (profileError) {
                console.error("❌ Error fetching profile:", profileError);
                // Create profile if it doesn't exist
                try {
                  const { error: insertError } = await supabase
                    .from("profiles")
                    .insert({
                      id: session.user.id,
                      email: session.user.email!,
                      name:
                        session.user.user_metadata?.name ||
                        session.user.email!.split("@")[0],
                    });

                  if (insertError) {
                    console.error("❌ Profile creation error:", insertError);
                  }

                  const user: User = {
                    id: session.user.id,
                    email: session.user.email!,
                    name:
                      session.user.user_metadata?.name ||
                      session.user.email!.split("@")[0],
                  };

                  set({
                    user,
                    isEmailVerified: true,
                    error: null,
                    isLoading: false,
                  });
                } catch (createError) {
                  console.error("❌ Failed to create profile:", createError);
                  set({
                    user: null,
                    isEmailVerified: false,
                    error: "Failed to load user data",
                    isLoading: false,
                  });
                }
              }
            } else {
              // ❌ Session exists but user is missing - this is the core issue
              console.warn("⚠️ Session exists but user data is missing:", {
                hasSession: !!session,
                hasUser: !!session?.user,
                hasUserId: !!session?.user?.id,
                sessionData: session,
              });

              // Clear the corrupted session and redirect to login
              try {
                await supabase.auth.signOut();
              } catch (signOutError) {
                console.error(
                  "❌ Error signing out corrupted session:",
                  signOutError,
                );
              }

              set({
                user: null,
                isEmailVerified: false,
                error: null,
                mode: "signin",
                isLoading: false,
              });
            }
          } else {
            // No session - normal case
            set({
              user: null,
              isEmailVerified: false,
              error: null,
              isLoading: false,
            });
          }

          // Listen for auth changes
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(
              "🔐 Auth state change:",
              event,
              session?.user,
              session?.user?.id,
            );

            try {
              switch (event) {
                case "SIGNED_IN":
                  if (session?.user && session.user.id) {
                    // ✅ Valid session with user - proceed normally
                    const { data: profile } = await supabase
                      .from("profiles")
                      .select("*")
                      .eq("id", session.user.id)
                      .single();

                    const user: User = {
                      id: session.user.id,
                      email: session.user.email!,
                      name:
                        profile?.name ||
                        session.user.user_metadata?.name ||
                        session.user.email!.split("@")[0],
                    };

                    set({
                      user,
                      isEmailVerified: true,
                      error: null,
                      mode: "signin",
                      isLoading: false,
                    });
                  } else if (session) {
                    // ❌ Session exists but user is missing - handle corrupted session
                    console.warn(
                      "⚠️ SIGNED_IN event but user data is missing:",
                      {
                        hasSession: !!session,
                        hasUser: !!session?.user,
                        hasUserId: !!session?.user?.id,
                        sessionData: session,
                      },
                    );

                    // Clear the corrupted session
                    try {
                      await supabase.auth.signOut();
                    } catch (signOutError) {
                      console.error(
                        "❌ Error signing out corrupted session:",
                        signOutError,
                      );
                    }

                    set({
                      user: null,
                      isEmailVerified: false,
                      error: null,
                      mode: "signin",
                      isLoading: false,
                    });
                  }
                  break;

                case "SIGNED_OUT":
                  set({
                    user: null,
                    isEmailVerified: false,
                    error: null,
                    mode: "signin",
                    emailForVerification: null,
                    isLoading: false,
                  });
                  break;

                case "PASSWORD_RECOVERY":
                  set({ mode: "reset", error: null, isLoading: false });
                  break;

                case "TOKEN_REFRESHED":
                  console.log("✅ Token refreshed successfully");
                  break;

                default:
                  break;
              }
            } catch (authError) {
              console.error("❌ Auth state change error:", authError);
              set({
                user: null,
                isEmailVerified: false,
                error: "Authentication error occurred",
                isLoading: false,
              });
            }
          });

          // Store subscription to clean up later if needed
          // Note: In most cases, Supabase handles cleanup automatically
        } catch (initError) {
          console.error("❌ Critical auth initialization error:", initError);
          set({
            user: null,
            isEmailVerified: false,
            error: "Failed to initialize authentication",
            isLoading: false,
          });
        }
      },

      // State management
      setMode: (mode: AuthMode) => set({ mode, error: null }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        user: state.user,
        isEmailVerified: state.isEmailVerified,
      }),
    },
  ),
);
