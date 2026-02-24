import { create } from "zustand";
import { Child } from "@/mocks/users";
import { supabase } from "@/libs/supabase";

interface ProfileState {
  children: Child[];
  selectedChildId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface ProfileActions {
  fetchChildren: (parentId: string) => Promise<void>;
  selectChild: (childId: string) => void;
  addChild: (parentId: string, child: Omit<Child, "id">) => Promise<void>;
  removeChild: (childId: string) => Promise<void>;
  updateChild: (
    childId: string,
    updates: Partial<Omit<Child, "id">>,
  ) => Promise<void>;
}

export type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>((set, get) => ({
  children: [],
  selectedChildId: null,
  isLoading: false,
  error: null,

  fetchChildren: async (parentId: string) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("parent_id", parentId);

    if (error) {
      set({
        children: [],
        selectedChildId: null,
        isLoading: false,
        error: error.message,
      });
      return;
    }

    set({
      children: data as Child[],
      selectedChildId: data?.[0]?.id || null,
      isLoading: false,
      error: null,
    });
  },

  selectChild: (childId) => {
    set({ selectedChildId: childId });
  },

  addChild: async (parentId, child) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from("children")
      .insert([{ ...child, parent_id: parentId }])
      .select()
      .single();
    console.log("Adding child:", data, error);

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }

    set((state) => ({
      children: [...state.children, data as Child],
      isLoading: false,
      error: null,
    }));
  },

  updateChild: async (childId, updates) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from("children")
      .update(updates)
      .eq("id", childId)
      .select()
      .single();

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }

    set((state) => ({
      children: state.children.map((child) =>
        child.id === childId ? { ...child, ...updates } : child,
      ),
      isLoading: false,
      error: null,
    }));
  },

  removeChild: async (childId) => {
    set({ isLoading: true, error: null });
    const { error } = await supabase
      .from("children")
      .delete()
      .eq("id", childId);

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }

    const filtered = get().children.filter((c) => c.id !== childId);
    set({
      children: filtered,
      selectedChildId: filtered[0]?.id || null,
      isLoading: false,
      error: null,
    });
  },
}));
