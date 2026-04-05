"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotesStore } from "../../stores/useNotesStore";
import { useMedicalHistoryStore } from "../../stores/useMedicalHistoryStore";
import { useTreatmentPlanStore } from "../../stores/useTreatmentPlanStore";

const sectionMap = {
  notes: useNotesStore,
  medicalhistory: useMedicalHistoryStore,
  treatmentplans: useTreatmentPlanStore,
};

export default function SubSectionModal({
  title,
  collectionId,
  patientId,
  onClose,
}) {
  const useStore = sectionMap[collectionId];
  const { items, fetchItems, addItem, deleteItem, updateItem, loading } =
    useStore();

  // Form states
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchItems(patientId);
  }, [patientId, fetchItems]);

  // Reset form based on section type
  useEffect(() => {
    switch (collectionId) {
      case "medicalhistory":
        setForm({
          medicalName: "",
          description: "",
          diagnosisDate: "",
          severity: "",
          status: "",
        });
        break;
      case "treatmentplans":
        setForm({
          treatmentNote: "",
          treatmentDate: "",
        });
        break;
      default:
        setForm({ name: "", description: "" });
    }
  }, [collectionId]);

  // Add / Update logic
  const handleAddOrUpdate = async () => {
    setAdding(true);
    try {
      if (editingId) {
        await updateItem(editingId, form);
      } else {
        await addItem(patientId, form);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save record");
    } finally {
      setAdding(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    switch (collectionId) {
      case "medicalhistory":
        setForm({
          medicalName: "",
          description: "",
          diagnosisDate: "",
          severity: "",
          status: "",
        });
        break;
      case "treatmentplans":
        setForm({
          treatmentNote: "",
          treatmentDate: "",
        });
        break;
      default:
        setForm({ name: "", description: "" });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.$id);
    setForm({ ...item });
  };

  return (
    <dialog open className="modal modal-open z-[1000]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          // UPDATED: Standard Tailwind classes for a wider modal and larger padding
          className="modal-box w-11/12 max-w-7xl bg-white text-[#1E2B1F] shadow-2xl border border-[#DCD1B4] rounded-2xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#E6D8BA] pb-4 mb-5 w-full">
            {/* UPDATED: Larger header font (text-2xl) */}
            <h3 className="font-bold text-2xl text-[#1E2B1F]">
              {title}{" "}
              {editingId && (
                <span className="text-gray-500 text-lg">(Editing)</span>
              )}
            </h3>
            <button
              onClick={onClose}
              className="btn btn-sm bg-transparent text-[#1E2B1F] hover:bg-[#E6D8BA] text-lg"
            >
              ✕
            </button>
          </div>

          {/* List */}
          {/* UPDATED: Increased max-height so it doesn't get cut off as early */}
          <div className="max-h-[40vh] overflow-y-auto space-y-3 mb-6 pr-2">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-[#EDE6D2] h-20 rounded-lg"
                />
              ))
            ) : items.length > 0 ? (
              items.map((i) => (
                <div
                  key={i.$id}
                  className="bg-[#EDE6D2] p-4 rounded-xl flex justify-between items-start shadow-sm"
                >
                  <div className="flex-1 pr-4">
                    {/* UPDATED: Larger item title (text-lg) */}
                    <h4 className="font-bold text-lg text-[#1E2B1F]">
                      {i.name || i.medicalName || i.treatmentNote}
                    </h4>
                    {/* UPDATED: Changed to sans-serif text-base and added wrap so it doesn't overflow */}
                    <pre className="text-base font-sans whitespace-pre-wrap text-[#4A4A4A] opacity-90 mt-1">
                      {i.description ||
                        i.status ||
                        (i.treatmentDate
                          ? new Date(i.treatmentDate).toLocaleString()
                          : "")}
                    </pre>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      className="btn btn-sm bg-[#56C596] text-white hover:bg-[#4BAE85]"
                      onClick={() => handleEdit(i)}
                      disabled={adding || loading}
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="btn btn-sm bg-[#E86D6D] text-white hover:bg-[#d65a5a]"
                      onClick={() => deleteItem(i.$id)}
                      disabled={adding || loading}
                    >
                      ✕ Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-base text-center py-6">
                No records found.
              </p>
            )}
          </div>

          {/* 🧾 Dynamic Form */}
          <div className="space-y-3">
            {collectionId === "medicalhistory" && (
              <>
                <input
                  type="text"
                  placeholder="Medical Name"
                  value={form.medicalName || ""}
                  onChange={(e) =>
                    setForm({ ...form, medicalName: e.target.value })
                  }
                  className="input w-full bg-[#FFF8EA] border border-[#DCD1B4] text-base h-12"
                />
                <textarea
                  placeholder="Description"
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="textarea w-full bg-[#FFF8EA] border border-[#DCD1B4] text-base h-28"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={form.diagnosisDate || new Date()}
                    onChange={(e) =>
                      setForm({ ...form, diagnosisDate: e.target.value })
                    }
                    className="input w-full bg-[#FFF8EA] border border-[#DCD1B4] text-base h-12"
                  />
                  <input
                    type="text"
                    placeholder="Severity"
                    value={form.severity || ""}
                    onChange={(e) =>
                      setForm({ ...form, severity: e.target.value })
                    }
                    className="input w-full bg-[#FFF8EA] border border-[#DCD1B4] text-base h-12"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Status"
                  value={form.status || ""}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input w-full bg-[#FFF8EA] border border-[#DCD1B4] text-base h-12"
                />
              </>
            )}

            {collectionId === "treatmentplans" && (
              <>
                <input
                  type="text"
                  placeholder="Treatment Note"
                  value={form.treatmentNote || ""}
                  onChange={(e) =>
                    setForm({ ...form, treatmentNote: e.target.value })
                  }
                  className="input w-full bg-[#FFF8EA] border border-[#DCD1B4] text-base h-12"
                />
                <input
                  type="datetime-local"
                  value={form.treatmentDate || new Date()}
                  onChange={(e) =>
                    setForm({ ...form, treatmentDate: e.target.value })
                  }
                  className="input w-full bg-[#FFF8EA] border border-[#DCD1B4] text-base h-12"
                />
              </>
            )}

            {collectionId === "notes" && (
              <>
                <input
                  type="text"
                  placeholder="Name / Title"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input w-full bg-[#FFF8EA] border border-[#DCD1B4] text-base h-12"
                />
                <textarea
                  placeholder="Description / Content"
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="textarea w-full bg-[#FFF8EA] border border-[#DCD1B4] text-base h-32"
                />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="modal-action flex justify-between mt-6">
            <button
              onClick={handleAddOrUpdate}
              disabled={adding || loading}
              className="btn btn-lg border-0 text-white bg-gradient-to-r from-[#A8E6CF] to-[#56C596] px-8"
            >
              {editingId
                ? adding
                  ? "Saving..."
                  : "Update"
                : adding
                  ? "Adding..."
                  : "Add Record"}
            </button>

            <div className="flex gap-2">
              {editingId && (
                <button
                  onClick={resetForm}
                  className="btn btn-lg bg-[#E6D8BA] text-[#1E2B1F]"
                  disabled={adding}
                >
                  Cancel Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="btn btn-lg bg-[#E6D8BA] text-[#1E2B1F]"
                disabled={adding || loading}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
