"use client";

import { useEffect, useState } from "react";
import {
  FiUserPlus,
  FiSearch,
  FiEye,
  FiPhone,
  FiClipboard,
} from "react-icons/fi";
import AddPatientModal from "../helper/AddPatientModal";
import { usePatientStore } from "@/app/stores/usePatientStore";
import ViewPatientDetailsModal from "../helper/ViewPatientDetailsModal";

export default function PatientsSection() {
  const [isOpen, setIsOpen] = useState(false);

  const { patients, fetchPatients, addPatient } = usePatientStore();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleView = (patient) => {
    setIsModalOpen(true);
    setSelectedPatient(patient);
  };

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const [formData, setFormData] = useState({
    activeTab: "general",
    name: "",
    age: "",
    contact: "",
    balance: "",
    dateAdded: "",
    medicalHistory: "",
    treatmentPlan: "",
    notes: "",
    prescriptions: "",
    payments: "",
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👥 Patients</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiUserPlus /> Add Patient
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
        {/* Patients Table */}
        {/* Table wrapper with max-height */}
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
                        {/* <button className="btn btn-outline btn-sm">Call</button> */}
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
                    {patient.patient_name}
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
                    <button className="btn btn-outline btn-sm flex-1">
                      Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddPatientModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSave={(newData) => {
          const newPatient = {
            id: patients.length + 1,
            name: newData.name,
            age: parseInt(newData.age) || 0,
            contact: newData.contact,
            balance: parseFloat(newData.balance) || 0,
            dateAdded: newData.dateAdded,
            medicalHistory: newData.medicalHistory,
            treatmentPlan: newData.treatmentPlan,
            notes: newData.notes,
            prescriptions: newData.prescriptions,
          };
        }}
      />

      <ViewPatientDetailsModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
