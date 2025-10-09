"use client";
import { useState, useEffect } from "react";
import { databases } from "@/app/lib/appwrite";
import { ID } from "appwrite";
import toast from "react-hot-toast";

import SubSectionModal from "./SubSectionModal";
import { useNotesStore } from "../../stores/useNotesStore";
import { useMedicalHistoryStore } from "../../stores/useMedicalHistoryStore";
import { useTreatmentPlanStore } from "../../stores/useTreatmentPlanStore";
import { usePaymentStore } from "@/app/stores/usePaymentStore";
import PaymentModal from "./PaymentModal";
import PaymentSectionCard from "./PaymentSectionCard";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const PATIENTS_COLLECTION_ID = "patients";

export default function ViewPatientDetailsModal({ patient, isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedPatient, setUpdatedPatient] = useState({ ...patient });
  const [saving, setSaving] = useState(false);

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
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  useEffect(() => {
    if (patient?.$id) {
      notes.fetchItems(patient.$id);
      medHistory.fetchItems(patient.$id);
      treatment.fetchItems(patient.$id);
      setUpdatedPatient({ ...patient });
    }
  }, [patient?.$id]);

  if (!patient || !isOpen) return null;

  const sectionsLoading =
    notes.loading || medHistory.loading || treatment.loading;

  const handleUpdatePatient = async () => {
    if (!updatedPatient.patientName?.trim()) {
      toast.error("Patient name is required");
      return;
    }

    try {
      setSaving(true);
      await databases.updateDocument(
        DATABASE_ID,
        PATIENTS_COLLECTION_ID,
        patient.$id,
        updatedPatient
      );
      toast.success("Patient details updated");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update patient");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal modal-open z-40">
        <div className="modal-box w-full sm:w-11/12 max-w-5xl rounded-2xl shadow-2xl p-0 max-h-[90vh] flex flex-col relative bg-white border border-mint-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-mint-500 text-white px-4 sm:px-6 py-4 sticky top-0 z-10 rounded-t-2xl flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                {patient.patientName}
              </h2>
              <p className="mt-1 text-sm opacity-90">
                Payment Balance:{" "}
                <span className="font-semibold text-yellow-200">
                  ₱{patient.balance || "0.00"}
                </span>
              </p>
            </div>
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className="btn btn-sm border-none bg-white text-green-700 hover:bg-green-100"
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 bg-mint-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <EditableField
                label="Full Name"
                name="patientName"
                value={updatedPatient.patientName}
                editMode={editMode}
                onChange={setUpdatedPatient}
              />
              <EditableField
                label="Gender"
                name="gender"
                value={updatedPatient.gender}
                editMode={editMode}
                onChange={setUpdatedPatient}
              />
              <EditableField
                label="Address"
                name="address"
                value={updatedPatient.address}
                editMode={editMode}
                onChange={setUpdatedPatient}
              />
              <EditableField
                label="Birthdate"
                name="birthdate"
                type="date"
                value={updatedPatient.birthdate}
                editMode={editMode}
                onChange={setUpdatedPatient}
              />
              <EditableField
                label="Contact Number"
                name="contact"
                value={updatedPatient.contact}
                editMode={editMode}
                onChange={setUpdatedPatient}
              />
              <EditableField
                label="Emergency Contact"
                name="emergencyToContact"
                value={updatedPatient.emergencyToContact}
                editMode={editMode}
                onChange={setUpdatedPatient}
              />
              <EditableField
                label="Emergency Contact Number"
                name="emergencyToContactNumber"
                value={updatedPatient.emergencyToContactNumber}
                editMode={editMode}
                onChange={setUpdatedPatient}
              />
              <EditableField
                label="Notes"
                name="note"
                type="textarea"
                value={updatedPatient.note}
                editMode={editMode}
                onChange={setUpdatedPatient}
              />
            </div>

            {/* Age Display */}
            <p className="mt-3 text-sm text-gray-600">
              Age: {calculateAge(updatedPatient.birthdate)} years old
            </p>

            {/* Sections */}
            <div className="mt-6 border-t border-mint-300 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sectionsLoading ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 bg-mint-100 rounded-xl animate-pulse h-20"
                  />
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
          <div className="modal-action border-t border-mint-300 px-4 sm:px-6 py-3 bg-mint-100 sticky bottom-0 z-10 flex justify-between">
            {editMode && (
              <button
                onClick={handleUpdatePatient}
                disabled={saving}
                className={`btn btn-success text-white ${
                  saving ? "loading" : ""
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
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

function EditableField({ label, name, value, editMode, onChange, type }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-green-700">{label}</span>
      {editMode ? (
        type === "textarea" ? (
          <textarea
            className="textarea textarea-bordered text-black bg-green-300 w-full"
            value={value || ""}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, [name]: e.target.value }))
            }
          />
        ) : (
          <input
            type={type || "text"}
            className="input input-bordered text-black bg-green-300 w-full"
            value={value || ""}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, [name]: e.target.value }))
            }
          />
        )
      ) : (
        <span className="text-base text-green-900">{value || "—"}</span>
      )}
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
