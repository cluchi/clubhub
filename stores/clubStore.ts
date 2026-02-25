import { create } from "zustand";
import { clubs, Club } from "@/mocks/clubs";
import { courses, Course } from "@/mocks/courses";
import { supabase } from "../libs/supabase";

interface ClubFilters {
  category: string | null;
  location: string | null;
  searchQuery: string | null;
}

interface ClubState {
  clubs: Club[];
  courses: Course[];
  filteredClubs: Club[];
  featuredClubs: Club[];
  recentSearches: string[];
  filters: ClubFilters;
  selectedClub: Club | null;
  selectedCourse: Course | null;
  isLoading: boolean;
  error: string | null;
}

interface ClubActions {
  fetchClubs: () => Promise<void>;
  fetchClubById: (clubId: string) => Promise<void>;
  fetchCourses: () => Promise<void>;
  setFilters: (filters: Partial<ClubFilters>) => void;
  clearFilters: () => void;
  searchClubs: (query: string) => void;
  selectClub: (clubId: string) => void;
  selectCourse: (courseId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export type ClubStore = ClubState & ClubActions;

export const useClubStore = create<ClubStore>((set, get) => ({
  clubs: [],
  courses: [],
  filteredClubs: [],
  featuredClubs: [],
  recentSearches: [],
  filters: {
    category: null,
    location: null,
    searchQuery: null,
  },
  selectedClub: null,
  selectedCourse: null,
  isLoading: false,
  error: null,

  fetchClubById: async (clubId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", clubId)
        .single();

      if (error || !data) {
        // Fallback to mock data if Supabase fails
        const club = clubs.find((c) => c.id === clubId) || null;
        set({
          selectedClub: club,
          isLoading: false,
          error: "Using offline data. Some features may be limited.",
        });
        return;
      }

      set({
        selectedClub: data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Fallback to mock data
      const club = clubs.find((c) => c.id === clubId) || null;
      set({
        selectedClub: club,
        isLoading: false,
        error: "Using offline data. Please check your connection.",
      });
    }
  },

  fetchClubs: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("🏢 Fetching clubs from Supabase...");

      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("rating", { ascending: false });

      if (error) {
        console.error("❌ Error fetching clubs:", error);
        // Fallback to mock data if Supabase fails
        set({
          clubs: clubs,
          filteredClubs: clubs,
          featuredClubs: clubs.slice(0, 3),
          isLoading: false,
          error: "Using offline data. Some features may be limited.",
        });
        return;
      }

      console.log("✅ Fetched", data?.length || 0, "clubs from Supabase");

      // Use Supabase data if available, otherwise fallback to mock data
      const clubsData = data && data.length > 0 ? data : clubs;

      set({
        clubs: clubsData,
        filteredClubs: clubsData,
        featuredClubs: clubsData.slice(0, 3),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("❌ Exception fetching clubs:", error);
      // Fallback to mock data
      set({
        clubs: clubs,
        filteredClubs: clubs,
        featuredClubs: clubs.slice(0, 3),
        isLoading: false,
        error: "Using offline data. Please check your connection.",
      });
    }
  },

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("🎨 Fetching courses from Supabase...");

      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          *,
          clubs (
            id,
            name,
            location
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching courses:", error);
        // Fallback to mock data
        set({
          courses: courses,
          isLoading: false,
          error: "Using offline data. Some features may be limited.",
        });
        return;
      }

      console.log("✅ Fetched", data?.length || 0, "courses from Supabase");

      // Transform database response to match CourseCard expectations
      let coursesData;
      if (data && data.length > 0) {
        // Transform database response to match Course interface
        coursesData = data.map((course: any) => ({
          ...course,
          clubId: course.clubs?.id || course.club_id,
          // Ensure all required fields are present
          instructor: course.instructor || {
            name: "Instructor",
            bio: "",
            experience: "",
            avatar: "I",
          },
          schedule: course.schedule || [
            {
              days: ["Monday"],
              time: "10:00 AM",
            },
          ],
          pricing: course.pricing || {
            dropIn: 20,
            monthly: 100,
            quarterly: 250,
          },
          ageRange: course.age_range || "5-12 years",
          skillLevel: course.skill_level || "Beginner",
          category: course.category || "General",
        }));
      } else {
        coursesData = courses;
      }

      set({
        courses: coursesData,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("❌ Exception fetching courses:", error);
      // Fallback to mock data
      set({
        courses: courses,
        isLoading: false,
        error: "Using offline data. Please check your connection.",
      });
    }
  },

  setFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };

    set({ filters: updatedFilters });

    // Apply filters
    const allClubs = get().clubs;
    let filtered = [...allClubs];

    if (updatedFilters.category) {
      filtered = filtered.filter(
        (club) => club.category === updatedFilters.category,
      );
    }

    if (updatedFilters.location) {
      filtered = filtered.filter((club) =>
        club.location.includes(updatedFilters.location || ""),
      );
    }

    if (updatedFilters.searchQuery) {
      const query = updatedFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(query) ||
          club.description.toLowerCase().includes(query),
      );
    }

    set({ filteredClubs: filtered });
  },

  clearFilters: () => {
    set({
      filters: {
        category: null,
        location: null,
        searchQuery: null,
      },
      filteredClubs: get().clubs,
    });
  },

  searchClubs: (query) => {
    if (query.trim()) {
      get().setFilters({ searchQuery: query });
      get().addRecentSearch(query);
    } else {
      get().setFilters({ searchQuery: null });
    }
  },

  selectClub: (clubId) => {
    const club = get().clubs.find((c) => c.id === clubId) || null;
    set({ selectedClub: club });
  },

  selectCourse: (courseId) => {
    const course = get().courses.find((c) => c.id === courseId) || null;
    set({ selectedCourse: course });
  },

  addRecentSearch: (query) => {
    if (query.trim()) {
      const currentSearches = get().recentSearches;
      // Remove if already exists and add to beginning
      const updatedSearches = [
        query,
        ...currentSearches.filter((s) => s !== query),
      ].slice(0, 5); // Keep only 5 recent searches

      set({ recentSearches: updatedSearches });
    }
  },

  clearRecentSearches: () => {
    set({ recentSearches: [] });
  },
}));
