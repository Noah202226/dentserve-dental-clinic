"use client";
import { useState, useEffect } from "react";
import SubSectionModal from "./SubSectionModal";

import { useNotesStore } from "../../stores/useNotesStore";
import { useMedicalHistoryStore } from "../../stores/useMedicalHistoryStore";
import { useTreatmentPlanStore } from "../../stores/useTreatmentPlanStore";
import { usePaymentStore } from "@/app/stores/usePaymentStore";
import PaymentModal from "./PaymentModal";
import PaymentSectionCard from "./PaymentSectionCard";

export default function ViewPatientDetailsModal({ patient, isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState(null);

  const notes = useNotesStore();
  const medHistory = useMedicalHistoryStore();
  const treatment = useTreatmentPlanStore();
  const paymentStore = usePaymentStore();

  function calculateAge(birthdate) {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  useEffect(() => {
    if (patient?.$id) {
      notes.fetchItems(patient.$id);
      medHistory.fetchItems(patient.$id);
      treatment.fetchItems(patient.$id);
    }
  }, [patient?.$id]);

  if (!patient || !isOpen) return null;

  const sectionsLoading =
    notes.loading || medHistory.loading || treatment.loading;

  return (
    <>
      <div className="modal modal-open z-40">
        <div className="modal-box w-full sm:w-11/12 max-w-5xl rounded-2xl shadow-2xl p-0 max-h-[90vh] flex flex-col relative bg-white border border-mint-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-mint-500 text-white px-4 sm:px-6 py-4 sticky top-0 z-10 rounded-t-2xl">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
              {patient.patientName} -{" "}
            </h2>
            <p className="mt-1 text-sm opacity-90">
              Payment Balance:{" "}
              <span className="font-semibold text-yellow-200">
                ₱{patient.balance || "0.00"}
              </span>
            </p>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 bg-mint-50">
            {/* Patient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Detail label="Address" value={patient.address} />
              <Detail label="Gender" value={patient.gender} />
              {/* <Detail label="Email" value={patient.email} /> */}
              <Detail
                label="Birthdate"
                value={new Date(patient.birthdate).toLocaleDateString()}
              />
              {/* Birthdate + Age */}
              <Detail
                label="Birthdate"
                value={
                  <>
                    <span className="text-gray-500 ml-2">
                      ({calculateAge(patient.birthdate)} years old)
                    </span>
                  </>
                }
              />
              <Detail label="Contact Number" value={patient.contact} />
              <Detail label="Note" value={patient.note} />
              <Detail
                label="Emergency Contact"
                value={patient.emergencyToContact}
              />
              <Detail
                label="Emergency Contact Number"
                value={patient.emergencyToContactNumber}
              />
            </div>

            {/* Sections */}
            <div className="mt-6 border-t border-mint-300 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sectionsLoading ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 bg-mint-100 rounded-xl animate-pulse h-20"
                  >
                    <div className="h-4 bg-green-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-green-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                <>
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

                  <PaymentSectionCard patient={patient} />
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-action border-t border-mint-300 px-4 sm:px-6 py-3 bg-mint-100 sticky bottom-0 z-10">
            <button
              onClick={onClose}
              className="btn bg-green-500 hover:bg-green-600 text-white border-none"
            >
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
      {activeSection?.collectionId === "payments" && (
        <PaymentModal
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
      <span className="text-sm font-semibold text-green-700">{label}</span>
      <span className="text-base text-green-900">
        {value && value !== "" ? value : "—"}
      </span>
    </div>
  );
}

function SectionCard({ title, count, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded-xl shadow-sm border border-mint-300 hover:shadow-md hover:bg-mint-100 cursor-pointer transition"
    >
      <h4 className="font-semibold text-green-700 flex items-center justify-between">
        {title}
        <span className="ml-2 text-green-500 text-sm">({count})</span>
      </h4>
      <p className="text-xs text-green-600 mt-1">
        {count > 0 ? "View details" : `Add ${title}`}
      </p>
    </div>
  );
}
