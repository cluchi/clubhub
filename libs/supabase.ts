import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://aikfndscooomjeyewhpl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpa2ZuZHNjb29vbWpleWV3aHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjE3ODUsImV4cCI6MjA2NDYzNzc4NX0.xurqToLG6T46c0W4LGFnLWwzeBmJCOWC8J77OLuqe3Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types for our database
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          updated_at?: string;
        };
      };
      children: {
        Row: {
          id: string;
          parent_id: string;
          name: string;
          age: number;
          avatar: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          name: string;
          age: number;
          avatar: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          name?: string;
          age?: number;
          avatar?: string;
          color?: string;
        };
      };
      clubs: {
        Row: {
          id: string;
          name: string;
          description: string;
          location: string;
          distance: number;
          rating: number;
          review_count: number;
          images: string[];
          amenities: string[];
          operating_hours: Record<string, { open: string; close: string }>;
          contact: {
            phone: string;
            email: string;
            address: string;
          };
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          location: string;
          distance: number;
          rating?: number;
          review_count?: number;
          images?: string[];
          amenities?: string[];
          operating_hours: Record<string, { open: string; close: string }>;
          contact: {
            phone: string;
            email: string;
            address: string;
          };
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          location?: string;
          distance?: number;
          rating?: number;
          review_count?: number;
          images?: string[];
          amenities?: string[];
          operating_hours?: Record<string, { open: string; close: string }>;
          contact?: {
            phone: string;
            email: string;
            address: string;
          };
          category?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          club_id: string;
          name: string;
          description: string;
          instructor: {
            name: string;
            bio: string;
            experience: string;
            avatar: string;
          };
          schedule: {
            days: string[];
            time: string;
          }[];
          pricing: {
            drop_in: number;
            monthly: number;
            quarterly: number;
          };
          age_range: string;
          skill_level: string;
          spots_available: number;
          total_spots: number;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          club_id: string;
          name: string;
          description: string;
          instructor: {
            name: string;
            bio: string;
            experience: string;
            avatar: string;
          };
          schedule: {
            days: string[];
            time: string;
          }[];
          pricing: {
            drop_in: number;
            monthly: number;
            quarterly: number;
          };
          age_range: string;
          skill_level: string;
          spots_available: number;
          total_spots: number;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          club_id?: string;
          name?: string;
          description?: string;
          instructor?: {
            name: string;
            bio: string;
            experience: string;
            avatar: string;
          };
          schedule?: {
            days: string[];
            time: string;
          }[];
          pricing?: {
            drop_in: number;
            monthly: number;
            quarterly: number;
          };
          age_range?: string;
          skill_level?: string;
          spots_available?: number;
          total_spots?: number;
          category?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          child_id: string;
          course_id: string;
          subscription_type: "drop_in" | "monthly" | "quarterly";
          status: "active" | "expiring" | "expired" | "on_hold";
          start_date: string;
          end_date: string;
          next_session: string;
          renewal_date: string;
          payment_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          course_id: string;
          subscription_type: "drop_in" | "monthly" | "quarterly";
          status?: "active" | "expiring" | "expired" | "on_hold";
          start_date: string;
          end_date: string;
          next_session: string;
          renewal_date: string;
          payment_method: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          course_id?: string;
          subscription_type?: "drop_in" | "monthly" | "quarterly";
          status?: "active" | "expiring" | "expired" | "on_hold";
          start_date?: string;
          end_date?: string;
          next_session?: string;
          renewal_date?: string;
          payment_method?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          subscription_id: string;
          session_date: string;
          status: "booked" | "completed" | "cancelled";
          can_reschedule: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          subscription_id: string;
          session_date: string;
          status?: "booked" | "completed" | "cancelled";
          can_reschedule?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          subscription_id?: string;
          session_date?: string;
          status?: "booked" | "completed" | "cancelled";
          can_reschedule?: boolean;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "reminder" | "renewal" | "new_course" | "schedule_change";
          title: string;
          message: string;
          timestamp: string;
          is_read: boolean;
          related_item_id: string | null;
          icon: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "reminder" | "renewal" | "new_course" | "schedule_change";
          title: string;
          message: string;
          timestamp?: string;
          is_read?: boolean;
          related_item_id?: string | null;
          icon: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "reminder" | "renewal" | "new_course" | "schedule_change";
          title?: string;
          message?: string;
          timestamp?: string;
          is_read?: boolean;
          related_item_id?: string | null;
          icon?: string;
          color?: string;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          type:
            | "visa"
            | "mastercard"
            | "amex"
            | "discover"
            | "apple"
            | "google";
          last4: string;
          expiry_month: number;
          expiry_year: number;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type:
            | "visa"
            | "mastercard"
            | "amex"
            | "discover"
            | "apple"
            | "google";
          last4: string;
          expiry_month: number;
          expiry_year: number;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?:
            | "visa"
            | "mastercard"
            | "amex"
            | "discover"
            | "apple"
            | "google";
          last4?: string;
          expiry_month?: number;
          expiry_year?: number;
          is_default?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
