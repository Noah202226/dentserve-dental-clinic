"use client";

import { create } from "zustand";
import { databases, ID } from "../lib/appwrite"; // adjust path
import toast from "react-hot-toast";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const PATIENTS_COLLECTION_ID = "patients";

export const usePatientStore = create((set, get) => ({
  patients: [],
  loading: false,

  // ✅ Fetch all patients
  fetchPatients: async () => {
    set({ loading: true });
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID
      );
      set({ patients: res.documents, loading: false });
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
      set({ loading: false });
    }
  },

  // ✅ Add new patient
  addPatient: async (patientData) => {
    try {
      const res = await databases.createDocument(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        ID.unique(),
        patientData
      );

      set((state) => ({
        patients: [...state.patients, res],
      }));

      toast.success("Patient added successfully!");
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to add patient");
    }
  },

  // ✅ Update patient
  updatePatient: async (id, updates) => {
    try {
      const res = await databases.updateDocument(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        id,
        updates
      );

      set((state) => ({
        patients: state.patients.map((p) => (p.$id === id ? res : p)),
      }));

      toast.success("Patient updated!");
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient");
    }
  },

  // ✅ Remove patient
  removePatient: async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, PATIENTS_COLLECTION_ID, id);

      set((state) => ({
        patients: state.patients.filter((p) => p.$id !== id),
      }));

      toast("Patient removed", { icon: "🗑️" });
    } catch (error) {
      console.error("Error removing patient:", error);
      toast.error("Failed to remove patient");
    }
  },
}));
