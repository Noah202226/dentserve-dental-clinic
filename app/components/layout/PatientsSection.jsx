"use client";

import { useEffect, useState } from "react";
import { FiUserPlus, FiSearch } from "react-icons/fi";
import AddPatientModal from "../helper/AddPatientModal";
import ViewPatientDetailsModal from "../helper/ViewPatientDetailsModal";
import { usePatientStore } from "@/app/stores/usePatientStore";

export default function PatientsSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    patient: null,
  });

  const { patients, fetchPatients, addPatient, deletePatient } =
    usePatientStore();

  const [loading, setLoading] = useState(false); // ✅ loading state for add
  const [deleteLoading, setDeleteLoading] = useState(false); // optional for delete

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (patient) => {
    setConfirmModal({ isOpen: true, patient });
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deletePatient(confirmModal.patient.$id);
      setConfirmModal({ isOpen: false, patient: null });
      fetchPatients();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSavePatient = async (newData) => {
    try {
      setLoading(true);
      await addPatient(newData);
      setIsOpen(false);
      fetchPatients();
    } catch (err) {
      console.error("Add patient failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👥 Patients</h1>
        <button
          onClick={() => setIsOpen(true)}
          className={`btn btn-primary flex items-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Adding...
            </>
          ) : (
            <>
              <FiUserPlus /> Add Patient
            </>
          )}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-200 rounded-xl p-4 shadow">
          <div className="stat-title">Total Patients</div>
          <div className="stat-value text-primary">{patients.length}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl p-4 shadow">
          <div className="stat-title">Active Patients</div>
          <div className="stat-value text-secondary">
            {patients.filter((p) => p.balance === 0).length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-xl p-4 shadow">
          <div className="stat-title">With Balance</div>
          <div className="stat-value text-error">
            {patients.filter((p) => p.balance > 0).length}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col h-full">
        <label className="input input-bordered flex items-center gap-2 w-full md:w-1/3">
          <FiSearch />
          <input
            type="text"
            className="grow"
            placeholder="Search patients..."
          />
        </label>

        {/* Table Wrapper */}
        <div className="flex-1 overflow-hidden">
          <div className="h-75 overflow-y-auto pr-2">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="table table-zebra w-full">
                <thead className="sticky top-0 bg-base-200 z-10">
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.$id}>
                      <td>{patient.patientName}</td>
                      <td>{patient.address}</td>
                      <td>{patient.contact}</td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleView(patient)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDeleteConfirm(patient)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="grid gap-4 md:hidden">
              {patients.map((patient) => (
                <div
                  key={patient.$id}
                  className="card bg-base-200 shadow-md p-4 rounded-lg"
                >
                  <h2 className="font-semibold text-lg">
                    {patient.patientName}
                  </h2>
                  <p className="text-sm text-gray-400">{patient.address}</p>
                  <p className="text-sm">{patient.contact}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="btn btn-info btn-sm flex-1"
                      onClick={() => handleView(patient)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-error btn-sm flex-1"
                      onClick={() => handleDeleteConfirm(patient)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSave={handleSavePatient}
        loading={loading} // ✅ pass to modal
      />

      {/* View Patient Modal */}
      <ViewPatientDetailsModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {confirmModal.isOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Confirm Delete</h3>
            <p className="py-3">
              Are you sure you want to delete{" "}
              <strong>{confirmModal.patient?.patientName}</strong>? <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="btn btn-outline"
                onClick={() =>
                  setConfirmModal({ isOpen: false, patient: null })
                }
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
