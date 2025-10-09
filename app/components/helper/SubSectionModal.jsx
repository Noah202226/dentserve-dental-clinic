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
  const { items, fetchItems, addItem, deleteItem, loading } = useStore();

  const [form, setForm] = useState({ name: "", description: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchItems(patientId);
  }, [patientId, fetchItems]);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      return alert("Please fill in all fields");
    }

    setAdding(true);
    try {
      if (collectionId === "notes") {
        await addItem({
          name: form.name,
          description: form.description,
          patientId,
        });
      } else {
        await addItem(patientId, form.name, form.description);
      }
      setForm({ name: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to save record");
    } finally {
      setAdding(false);
    }
  };

  return (
    <dialog open className="modal modal-open z-[1000]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="modal-box max-w-lg bg-white text-[#1E2B1F] shadow-xl border border-[#DCD1B4] rounded-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#E6D8BA] pb-3 mb-3">
            <h3 className="font-bold text-lg text-[#1E2B1F]">{title}</h3>
            <button
              onClick={onClose}
              className="btn btn-sm bg-transparent text-[#1E2B1F] hover:bg-[#E6D8BA]"
            >
              ✕
            </button>
          </div>

          {/* Content List */}
          <div className="max-h-60 overflow-y-auto space-y-2 mb-4 pr-1">
            {loading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-[#EDE6D2] h-16 rounded-lg"
                  />
                ))}
              </>
            ) : items.length > 0 ? (
              items.map((i) => (
                <div
                  key={i.$id}
                  className="bg-[#EDE6D2] p-3 rounded-lg flex justify-between items-start shadow-sm"
                >
                  <div>
                    <h4 className="font-semibold text-[#1E2B1F]">
                      {i.name || i.title}
                    </h4>
                    <p className="text-sm text-[#4A4A4A] opacity-90">
                      {i.description || i.content}
                    </p>
                  </div>
                  <button
                    className="btn btn-xs bg-[#E86D6D] text-white hover:bg-[#d65a5a]"
                    onClick={() => deleteItem(i.$id)}
                    disabled={adding || loading}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                No records found.
              </p>
            )}
          </div>

          {/* Form Inputs */}
          <input
            type="text"
            placeholder="Name / Title"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input w-full bg-[#FFF8EA] border border-[#DCD1B4] mb-2 text-[#1E2B1F] placeholder-[#9C8E71]"
          />
          <textarea
            placeholder="Description / Content"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="textarea w-full bg-[#FFF8EA] border border-[#DCD1B4] text-[#1E2B1F] placeholder-[#9C8E71]"
          />

          {/* Footer */}
          <div className="modal-action">
            {title === "Dental Notes" ? (
              <button
                onClick={handleAdd}
                disabled={adding || loading}
                className={`btn border-0 text-white ${
                  adding ? "loading" : ""
                } bg-gradient-to-r from-[#A8E6CF] to-[#56C596] hover:opacity-90`}
              >
                {adding ? "Adding..." : "Add"}
              </button>
            ) : (
              <span className="text-sm text-gray-500">Add disabled</span>
            )}
            <button
              className="btn bg-[#E6D8BA] text-[#1E2B1F] hover:bg-[#DCD1B4]"
              onClick={onClose}
              disabled={adding || loading}
            >
              Close
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
