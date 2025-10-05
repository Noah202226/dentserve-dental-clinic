"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { databases, ID } from "../lib/appwrite";
import { Query } from "appwrite";
import toast from "react-hot-toast";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;

/**
 * ✅ Reusable Zustand store factory for patient sections (Notes, Medical History, etc.)
 */
export const createSectionStore = (collectionId, label) =>
  create(
    persist(
      (set, get) => ({
        items: [],
        loading: false,
        error: null, // ⚡ optional: store error state too

        // 🔹 Fetch section items by patientId
        fetchItems: async (patientId) => {
          if (!patientId) return;
          set({ loading: true, error: null });
          try {
            const res = await databases.listDocuments(
              DATABASE_ID,
              collectionId,
              [Query.equal("patientId", patientId)]
            );
            set({ items: res.documents });
          } catch (err) {
            console.error(`Error fetching ${label}:`, err);
            set({ error: err.message || "Failed to load data" });
            toast.error(`Failed to load ${label}`);
          } finally {
            set({ loading: false });
          }
        },

        // 🔹 Add a new item
        addItem: async (patientId, title, content) => {
          if (!title.trim()) return toast.error("Title is required");
          set({ loading: true });
          try {
            const doc = await databases.createDocument(
              DATABASE_ID,
              collectionId,
              ID.unique(),
              {
                patientId,
                title,
                content,
                createdAt: new Date().toISOString(),
              }
            );
            set({ items: [doc, ...get().items] });
            toast.success(`${label} added!`);
          } catch (err) {
            console.error(`Add ${label} failed:`, err);
            toast.error(`Failed to add ${label}`);
          } finally {
            set({ loading: false });
          }
        },

        // 🔹 Delete item
        deleteItem: async (id) => {
          set({ loading: true });
          try {
            await databases.deleteDocument(DATABASE_ID, collectionId, id);
            set({ items: get().items.filter((i) => i.$id !== id) });
            toast.success(`${label} deleted`);
          } catch (err) {
            console.error(`Delete ${label} failed:`, err);
            toast.error("Delete failed");
          } finally {
            set({ loading: false });
          }
        },

        // 🔹 Clear store manually
        clear: () => set({ items: [], error: null }),
      }),
      {
        name: `${collectionId}-store`, // persist key
      }
    )
  );
