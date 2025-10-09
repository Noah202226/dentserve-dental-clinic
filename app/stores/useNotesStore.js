"use client";
import { create } from "zustand";
import { databases } from "@/app/lib/appwrite"; // adjust if your path differs
import { ID, Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID = "notes";

export const useNotesStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  // ✅ Fetch all notes for a patient
  fetchItems: async (patientId) => {
    if (!patientId) return;
    set({ loading: true, error: null });

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("patientId", patientId), Query.orderDesc("$createdAt")]
      );
      set({ items: response.documents });
    } catch (error) {
      console.error("Error fetching notes:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Add new note
  addItem: async ({ name, description, patientId }) => {
    if (!name || !description || !patientId) return;
    set({ loading: true });

    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        name,
        description,
        patientId,
      });
      await get().fetchItems(patientId);
    } catch (error) {
      console.error("Error adding note:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Update existing note
  updateItem: async (id, data) => {
    if (!id || !data) return;
    set({ loading: true });

    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, data);

      // Refresh the list after update
      const currentItems = get().items;
      const updated = currentItems.map((item) =>
        item.$id === id ? { ...item, ...data } : item
      );
      set({ items: updated });
    } catch (error) {
      console.error("Error updating note:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Delete note
  deleteItem: async (id) => {
    if (!id) return;
    set({ loading: true });

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      set({
        items: get().items.filter((item) => item.$id !== id),
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
}));
