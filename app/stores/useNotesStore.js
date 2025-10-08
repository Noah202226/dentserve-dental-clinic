"use client";

import { create } from "zustand";
import { ID, Query } from "appwrite";
import toast from "react-hot-toast";
import { databases } from "../lib/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID = "notes";

export const useNotesStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchItems: async (patientId) => {
    set({ loading: true });
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal("patientId", patientId),
      ]);
      set({ items: res.documents });
    } catch (err) {
      console.error("Fetch notes failed:", err);
      toast.error("Failed to load notes");
    } finally {
      set({ loading: false });
    }
  },

  addItem: async ({ name, description, patientId }) => {
    try {
      const newDoc = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        { name, description, patientId }
      );
      set({ items: [newDoc, ...get().items] });
      toast.success("Note added!");
    } catch (err) {
      console.error("Add note failed:", err);
      toast.error("Failed to add note");
    }
  },

  deleteItem: async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      set({ items: get().items.filter((i) => i.$id !== id) });
      toast.success("Note deleted");
    } catch (err) {
      console.error("Delete note failed:", err);
      toast.error("Failed to delete note");
    }
  },
}));
