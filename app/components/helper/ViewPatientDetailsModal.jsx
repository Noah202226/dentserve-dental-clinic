"use client";
import { useState, useEffect } from "react";
import SubSectionModal from "./SubSectionModal";

import { useNotesStore } from "../../stores/useNotesStore";
import { useMedicalHistoryStore } from "../../stores/useMedicalHistoryStore";
import { useTreatmentPlanStore } from "../../stores/useTreatmentPlanStore";

export default function ViewPatientDetailsModal({ patient, isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState(null);

  const notes = useNotesStore();
  const medHistory = useMedicalHistoryStore();
  const treatment = useTreatmentPlanStore();

  useEffect(() => {
    if (patient?.$id) {
      notes.fetchItems(patient.$id);
      medHistory.fetchItems(patient.$id);
      treatment.fetchItems(patient.$id);
    }
  }, [patient?.$id]);

  if (!patient || !isOpen) return null;

  return (
    <>
      <div className="modal modal-open z-40">
        <div className="modal-box w-full sm:w-11/12 max-w-5xl rounded-2xl shadow-xl p-0 max-h-[90vh] flex flex-col relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 sm:px-6 py-4 sticky top-0 z-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
              {patient.patientName}
            </h2>
            <p className="mt-1 text-sm opacity-90">
              Payment Balance:{" "}
              <span className="font-semibold text-yellow-300">
                ₱{patient.balance || "0.00"}
              </span>
            </p>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
            {/* Patient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Detail label="Email" value={patient.email} />
              <Detail label="Gender" value={patient.gender} />
              <Detail label="Address" value={patient.address} />
              <Detail label="Birthdate" value={patient.birthdate} />
              <Detail label="Contact Number" value={patient.contact} />
            </div>

            {/* Sections */}
            <div className="mt-6 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <SectionCard
                title="Medical History"
                count={medHistory.items.length}
                onClick={() =>
                  setActiveSection({
                    title: "Medical History",
                    collectionId: "medicalhistory",
                  })
                }
              />
              <SectionCard
                title="Dental Notes"
                count={notes.items.length}
                onClick={() =>
                  setActiveSection({
                    title: "Dental Notes",
                    collectionId: "notes",
                  })
                }
              />
              <SectionCard
                title="Treatment Plan"
                count={treatment.items.length}
                onClick={() =>
                  setActiveSection({
                    title: "Treatment Plan",
                    collectionId: "treatmentplans",
                  })
                }
              />
              {/* <SectionCard
                title="Dental Chart"
                count={dental.items.length}
                onClick={() =>
                  setActiveSection({
                    title: "Dental Chart",
                    collectionId: "dentalcharts",
                  })
                }
              /> */}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-action border-t px-4 sm:px-6 py-3 bg-gray-50 sticky bottom-0 z-10">
            <button onClick={onClose} className="btn btn-neutral">
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Subsection Modal */}
      {activeSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <SubSectionModal
            title={activeSection.title}
            collectionId={activeSection.collectionId}
            patientId={patient.$id}
            onClose={() => setActiveSection(null)}
          />
        </div>
      )}
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-600">{label}</span>
      <span className="text-base text-gray-900">
        {value && value !== "" ? value : "—"}
      </span>
    </div>
  );
}

function SectionCard({ title, count, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md cursor-pointer transition"
    >
      <h4 className="font-semibold text-gray-700 flex items-center justify-between">
        {title}
        <span className="ml-2 text-indigo-600 text-sm">({count})</span>
      </h4>
      <p className="text-xs text-gray-500 mt-1">
        {count > 0 ? "View details" : `Add ${title}`}
      </p>
    </div>
  );
}
