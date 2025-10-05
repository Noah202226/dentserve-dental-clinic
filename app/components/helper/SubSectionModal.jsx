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

  useEffect(() => {
    fetchItems(patientId);
  }, [patientId]);

  const handleAdd = async () => {
    await addItem(patientId, form.title, form.content);
    setForm({ title: "", content: "" });
  };

  return (
    <dialog open className="modal modal-open z-[1000]">
      <div className="modal-box max-w-lg">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
          {items.length > 0 ? (
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
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No records found.</p>
          )}
        </div>

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

        <div className="modal-action">
          <button
            onClick={handleAdd}
            className={`btn btn-primary ${loading ? "loading" : ""}`}
          >
            Add
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
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
