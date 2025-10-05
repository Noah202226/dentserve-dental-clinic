"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { databases, ID } from "../lib/appwrite";
import { Query } from "appwrite";
import toast from "react-hot-toast";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;

/**
 * Factory to create a reusable Zustand store for any patient section
 */
export const createSectionStore = (collectionId, label) =>
  create(
    persist(
      (set, get) => ({
        items: [],
        loading: false,

        // 🔹 Fetch section items by patientId
        fetchItems: async (patientId) => {
          if (!patientId) return;
          set({ loading: true });
          try {
            const res = await databases.listDocuments(
              DATABASE_ID,
              collectionId,
              [Query.equal("patientId", patientId)]
            );
            set({ items: res.documents });
          } catch (err) {
            console.error(`Error fetching ${label}:`, err);
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
            console.error(err);
            toast.error(`Failed to add ${label}`);
          } finally {
            set({ loading: false });
          }
        },

        // 🔹 Delete item
        deleteItem: async (id) => {
          try {
            await databases.deleteDocument(DATABASE_ID, collectionId, id);
            set({ items: get().items.filter((i) => i.$id !== id) });
            toast.success("Deleted successfully");
          } catch (err) {
            console.error(err);
            toast.error("Delete failed");
          }
        },

        // 🔹 Clear items manually
        clear: () => set({ items: [] }),
      }),
      {
        name: `${collectionId}-store`, // persist key
      }
    )
  );
