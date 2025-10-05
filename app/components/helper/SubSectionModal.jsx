"use client";
import { useState, useEffect } from "react";
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
  const [form, setForm] = useState({ title: "", content: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchItems(patientId);
  }, [patientId]);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setAdding(true);
    await addItem(patientId, form.title, form.content);
    setForm({ title: "", content: "" });
    setAdding(false);
  };

  return (
    <dialog open className="modal modal-open z-[1000]">
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
          {loading ? (
            // 🔹 Loading skeleton while fetching
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-base-200 h-16 rounded-md"
                />
              ))}
            </>
          ) : items.length > 0 ? (
            items.map((i) => (
              <div
                key={i.$id}
                className="bg-base-200 p-3 rounded-md flex justify-between items-start"
              >
                <div>
                  <h4 className="font-semibold">{i.title}</h4>
                  <p className="text-sm opacity-80">{i.content}</p>
                </div>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => deleteItem(i.$id)}
                  disabled={adding || loading}
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">
              No records found.
            </p>
          )}
        </div>

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input input-bordered w-full mb-2"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="textarea textarea-bordered w-full"
        />

        {/* Footer / Actions */}
        <div className="modal-action">
          <button
            onClick={handleAdd}
            disabled={adding || loading}
            className={`btn btn-primary ${adding ? "loading" : ""}`}
          >
            {adding ? "Adding..." : "Add"}
          </button>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={adding || loading}
          >
            Close
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
