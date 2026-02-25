import { create } from "zustand";
import { Subscription, Booking } from "@/mocks/subscriptions";
import { supabase } from "@/libs/supabase";

// Import mock data for fallback
import { subscriptions as mockSubscriptions } from "@/mocks/subscriptions";
import { bookings as mockBookings } from "@/mocks/subscriptions";

// Helper function to format dates for Supabase
const formatSupabaseTimestamp = (date: Date): string => {
  // Supabase expects ISO string format for timestamp columns
  return date.toISOString();
};

// Helper function to create bookings for a subscription
const createSubscriptionBookings = async (
  subscriptionId: string,
  courseId: string,
  startDate: Date,
  endDate: Date,
  subscriptionType: "drop_in" | "monthly" | "quarterly",
) => {
  try {
    // Only create bookings for monthly and quarterly subscriptions
    if (subscriptionType === "drop_in") {
      return; // Drop-in subscriptions don't need pre-created bookings
    }

    // Get course schedule from mock data (in a real app, this would come from the database)
    const { courses } = await import("@/mocks/courses");
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      console.warn("Course not found for creating bookings");
      return;
    }

    const bookingsToCreate: Omit<Booking, "id">[] = [];
    let bookingDate = new Date(startDate);

    // Create bookings for the subscription period
    while (bookingDate <= endDate) {
      // Check if this day matches the course schedule
      const dayOfWeek = bookingDate.getDay().toString();

      for (const schedule of course.schedule) {
        if (schedule.days.includes(dayOfWeek)) {
          // Parse the time string (e.g., "16:00:00") and create booking date
          const [hours, minutes, seconds] = schedule.time
            .split(":")
            .map(Number);
          const bookingDateTime = new Date(bookingDate);
          bookingDateTime.setHours(hours, minutes, seconds, 0);

          bookingsToCreate.push({
            subscriptionId,
            sessionDate: formatSupabaseTimestamp(bookingDateTime),
            status: "booked",
            canReschedule: true,
          });
        }
      }

      // Move to next day
      bookingDate.setDate(bookingDate.getDate() + 1);
    }

    // Insert bookings into database
    if (bookingsToCreate.length > 0) {
      const { error } = await supabase
        .from("bookings")
        .insert(bookingsToCreate);

      if (error) {
        console.error("Failed to create bookings:", error.message);
      }
    }
  } catch (error) {
    console.error("Error creating subscription bookings:", error);
  }
};

interface SubscriptionState {
  subscriptions: Subscription[];
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

interface SubscriptionActions {
  fetchSubscriptions: (child_id: string) => Promise<void>;
  fetchBookings: (subscriptionId: string) => Promise<void>;
  subscribeToCourse: (
    child_id: string,
    courseId: string,
    subscriptionType: "drop_in" | "monthly" | "quarterly",
    paymentMethod: string,
  ) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  getSubscriptionsForChild: (child_id: string) => Subscription[];
  getSubscriptionForCourse: (
    courseId: string,
    child_id: string,
  ) => Subscription | null;
  updateSubscriptionStatus: (
    subscriptionId: string,
    status: Subscription["status"],
  ) => Promise<void>;
}

export type SubscriptionStore = SubscriptionState & SubscriptionActions;

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  bookings: [],
  isLoading: false,
  error: null,

  fetchSubscriptions: async (child_id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("child_id", child_id);

      if (error) {
        // Fallback to mock data
        const filteredSubscriptions = mockSubscriptions.filter(
          (s: Subscription) => s.child_id === child_id,
        );
        set({
          subscriptions: filteredSubscriptions,
          isLoading: false,
          error: "Using offline data. Some features may be limited.",
        });
        return;
      }

      set({
        subscriptions: data || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Fallback to mock data
      const filteredSubscriptions = mockSubscriptions.filter(
        (s: Subscription) => s.child_id === child_id,
      );
      set({
        subscriptions: filteredSubscriptions,
        isLoading: false,
        error: "Using offline data. Please check your connection.",
      });
    }
  },

  fetchBookings: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("subscription_id", subscriptionId)
        .order("session_date", { ascending: true });

      if (error) {
        // Fallback to mock data
        const filteredBookings = mockBookings.filter(
          (b: Booking) => b.subscriptionId === subscriptionId,
        );
        set({
          bookings: filteredBookings,
          isLoading: false,
          error: "Using offline data. Some features may be limited.",
        });
        return;
      }

      set({
        bookings: data || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Fallback to mock data
      const filteredBookings = mockBookings.filter(
        (b: Booking) => b.subscriptionId === subscriptionId,
      );
      set({
        bookings: filteredBookings,
        isLoading: false,
        error: "Using offline data. Please check your connection.",
      });
    }
  },

  subscribeToCourse: async (
    child_id: string,
    course_id: string,
    subscriptionType: "drop_in" | "monthly" | "quarterly",
    payment_method: string,
  ) => {
    set({ isLoading: true, error: null });

    // Check if child already has a subscription to this course
    const existingSubscription = get().getSubscriptionForCourse(
      course_id,
      child_id,
    );

    console.log(
      "Attempting to subscribe child",
      child_id,
      "to course",
      course_id,
    );
    console.log("Existing subscription:", existingSubscription);

    if (existingSubscription) {
      set({
        isLoading: false,
        error: "This child already has a subscription to this course.",
      });
      return;
    }

    try {
      // Calculate subscription dates based on type
      const now = new Date();
      const start_date = formatSupabaseTimestamp(now);
      let end_date = "";
      let renewal_date = "";

      if (subscriptionType === "monthly") {
        const end = new Date(now);
        end.setMonth(end.getMonth() + 1);
        end_date = formatSupabaseTimestamp(end);
        renewal_date = end_date;
      } else if (subscriptionType === "quarterly") {
        const end = new Date(now);
        end.setMonth(end.getMonth() + 3);
        end_date = formatSupabaseTimestamp(end);
        renewal_date = end_date;
      } else {
        // drop_in - set to 6 months
        const end = new Date(now);
        end.setMonth(end.getMonth() + 6);
        end_date = formatSupabaseTimestamp(end);
        renewal_date = end_date;
      }

      const newSubscription: Omit<Subscription, "id" | "next_session"> = {
        child_id,
        course_id,
        subscription_type: subscriptionType,
        status: "active",
        start_date,
        end_date,
        renewal_date,
        payment_method,
      };

      console.log("Creating subscription with data:", newSubscription);
      const { data, error } = await supabase
        .from("subscriptions")
        .insert([newSubscription])
        .select()
        .single();

      if (error) {
        // Check if it's a timestamp format error
        console.error("Error creating subscription:", error.message);
        if (
          error.message.includes("timestamp") ||
          error.message.includes("timezone")
        ) {
          set({
            isLoading: false,
            error: "Date format error. Please try subscribing again.",
          });
        } else {
          set({
            isLoading: false,
            error: error.message,
          });
        }
        return;
      }

      // Create bookings for the subscription (if monthly or quarterly)
      if (subscriptionType !== "drop_in") {
        await createSubscriptionBookings(
          data.id,
          course_id,
          now,
          subscriptionType === "monthly"
            ? new Date(now.setMonth(now.getMonth() + 1))
            : new Date(now.setMonth(now.getMonth() + 3)),
          subscriptionType,
        );
      }

      // Add to local state
      set((state) => ({
        subscriptions: [...state.subscriptions, data as Subscription],
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: "Failed to create subscription. Please try again.",
      });
    }
  },

  cancelSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "expired" })
        .eq("id", subscriptionId);

      if (error) {
        set({
          isLoading: false,
          error: error.message,
        });
        return;
      }

      // Update local state
      set((state) => ({
        subscriptions: state.subscriptions.map((sub) =>
          sub.id === subscriptionId
            ? { ...sub, status: "expired" as Subscription["status"] }
            : sub,
        ),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: "Failed to cancel subscription. Please try again.",
      });
    }
  },

  getSubscriptionsForChild: (child_id: string) => {
    return get().subscriptions.filter((s) => s.child_id === child_id);
  },

  getSubscriptionForCourse: (course_id: string, child_id: string) => {
    const subscription = get().subscriptions.find(
      (s) => s.course_id === course_id && s.child_id === child_id,
    );
    return subscription || null;
  },

  updateSubscriptionStatus: async (
    subscriptionId: string,
    status: Subscription["status"],
  ) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status })
        .eq("id", subscriptionId);

      if (error) {
        set({
          isLoading: false,
          error: error.message,
        });
        return;
      }

      // Update local state
      set((state) => ({
        subscriptions: state.subscriptions.map((sub) =>
          sub.id === subscriptionId ? { ...sub, status } : sub,
        ),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: "Failed to update subscription status. Please try again.",
      });
    }
  },
}));
