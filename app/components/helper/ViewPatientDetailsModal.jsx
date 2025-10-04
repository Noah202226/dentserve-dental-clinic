"use client";

import { useState } from "react";
import SubsectionModal from "./SubSectionModal";

export default function ViewPatientDetailsModal({ patient, isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState(null);

  if (!patient || !isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="modal modal-open z-40">
        <div className="modal-box w-full sm:w-11/12 max-w-5xl rounded-2xl shadow-xl p-0 max-h-[90vh] flex flex-col relative">
          {/* Sticky Header */}
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

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Detail label="Email" value={patient.email} />
              <Detail label="Gender" value={patient.gender} />
              <Detail label="Address" value={patient.address} />
              <Detail label="Birthdate" value={patient.birthdate} />
              <Detail label="Contact Number" value={patient.contact} />
              <Detail
                label="Emergency Contact"
                value={patient.emergency_contact}
              />
              <Detail
                label="Emergency Relation"
                value={patient.emergency_relation}
              />
              <Detail label="Date Added" value={patient.date_added} />
              <Detail label="Recall Date" value={patient.recall_date} />
              <Detail label="Profession / Job" value={patient.profession} />
              <Detail
                label="Identification No."
                value={patient.identification_no}
              />
            </div>

            {/* Section Cards */}
            <div className="mt-6 border-t pt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <SectionCard
                title="Medical History"
                onClick={() =>
                  setActiveSection({
                    label: "Medical History",
                    collectionId: "medicalhistory",
                  })
                }
              />
              <SectionCard
                title="Dental Notes"
                onClick={() =>
                  setActiveSection({
                    label: "Dental Notes",
                    collectionId: "notes",
                  })
                }
              />
              <SectionCard
                title="Treatment Plan"
                onClick={() =>
                  setActiveSection({
                    label: "Treatment Plan",
                    collectionId: "treatmentplans",
                  })
                }
              />
              <SectionCard
                title="Dental Chart"
                onClick={() =>
                  setActiveSection({
                    label: "Dental Chart",
                    collectionId: "dentalcharts",
                  })
                }
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="modal-action border-t px-4 sm:px-6 py-3 bg-gray-50 sticky bottom-0 z-10">
            <button
              onClick={onClose}
              className="btn btn-neutral w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Subsection Modal */}
      {activeSection && (
        <SubsectionModal
          open={!!activeSection}
          section={activeSection}
          patientId={patient.$id}
          onClose={() => setActiveSection(null)}
        />
      )}
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        {label}
      </span>
      <span className="text-base text-gray-900 dark:text-white break-words">
        {value && value !== "" ? value : "—"}
      </span>
    </div>
  );
}

function SectionCard({ title, onClick }) {
  return (
    <div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border hover:shadow-md cursor-pointer transition"
      onClick={onClick}
    >
      <h4 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-between">
        {title}
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        View or add {title.toLowerCase()}
      </p>
    </div>
  );
}
