"use client";

import { useState } from "react";
import {
  FiUserPlus,
  FiSearch,
  FiEye,
  FiPhone,
  FiClipboard,
} from "react-icons/fi";

export default function PatientsSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Juan Dela Cruz",
      age: 28,
      contact: "0917-123-4567",
      balance: 5000,
    },
    {
      id: 2,
      name: "Maria Santos",
      age: 34,
      contact: "0918-222-1111",
      balance: 0,
    },
    {
      id: 3,
      name: "Jose Rizal",
      age: 45,
      contact: "0920-555-8888",
      balance: 1200,
    },
  ]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPatient = {
      id: patients.length + 1,
      name: formData.name,
      age: parseInt(formData.age) || 0,
      contact: formData.contact,
      balance: parseFloat(formData.payments) || 0,
      // extra details can be stored in future in DB
      dateAdded: formData.dateAdded,
      medicalHistory: formData.medicalHistory,
      treatmentPlan: formData.treatmentPlan,
      notes: formData.notes,
      prescriptions: formData.prescriptions,
    };

    setPatients((prev) => [...prev, newPatient]);

    // reset form + close modal
    setFormData({
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
    setIsOpen(false);
  };

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
      <div className="flex justify-between items-center">
        <label className="input input-bordered flex items-center gap-2 w-full md:w-1/3">
          <FiSearch />
          <input
            type="text"
            className="grow"
            placeholder="Search patients..."
          />
        </label>
      </div>

      {/* Patients Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Contact</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.contact}</td>
                    <td
                      className={p.balance > 0 ? "text-error" : "text-success"}
                    >
                      ₱{p.balance.toLocaleString()}
                    </td>
                    <td className="flex gap-2">
                      <button className="btn btn-xs btn-info">
                        <FiEye /> View
                      </button>
                      <button className="btn btn-xs btn-outline">
                        <FiPhone /> Call
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <FiClipboard /> Add New Patient
            </h3>

            {/* Tabs */}
            <div role="tablist" className="tabs tabs-boxed mb-4 ">
              <button
                role="tab"
                className={`tab mx-20 font-bold  ${
                  formData.activeTab === "general" ? "tab-active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, activeTab: "general" }))
                }
              >
                General Info
              </button>
              <button
                role="tab"
                className={`tab mx-20 font-bold ${
                  formData.activeTab === "medical" ? "tab-active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, activeTab: "medical" }))
                }
              >
                Medical
              </button>
              <button
                role="tab"
                className={`tab mx-20 font-bold ${
                  formData.activeTab === "financial" ? "tab-active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, activeTab: "financial" }))
                }
              >
                Financial
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* General Info Tab */}
              {formData.activeTab === "general" && (
                <div className="space-y-3">
                  <div className="form-control">
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Contact</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="Enter contact number"
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Date Added</label>
                    <input
                      type="date"
                      name="dateAdded"
                      value={formData.dateAdded}
                      onChange={handleChange}
                      className="input input-bordered"
                    />
                  </div>
                </div>
              )}

              {/* Medical Tab */}
              {formData.activeTab === "medical" && (
                <div className="space-y-3">
                  <div className="form-control">
                    <label className="label">Medical History</label>
                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      className="textarea textarea-bordered"
                      placeholder="Enter medical history"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Treatment Plan</label>
                    <textarea
                      name="treatmentPlan"
                      value={formData.treatmentPlan}
                      onChange={handleChange}
                      className="textarea textarea-bordered"
                      placeholder="Enter treatment plan"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="textarea textarea-bordered"
                      placeholder="Additional notes"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Prescriptions</label>
                    <textarea
                      name="prescriptions"
                      value={formData.prescriptions}
                      onChange={handleChange}
                      className="textarea textarea-bordered"
                      placeholder="List prescriptions"
                    />
                  </div>
                </div>
              )}

              {/* Financial Tab */}
              {formData.activeTab === "financial" && (
                <div className="space-y-3">
                  <div className="form-control">
                    <label className="label">Payments</label>
                    <input
                      type="number"
                      name="payments"
                      value={formData.payments}
                      onChange={handleChange}
                      placeholder="Enter payment amount"
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Balance</label>
                    <input
                      type="number"
                      name="balance"
                      value={formData.balance}
                      onChange={handleChange}
                      placeholder="Enter balance"
                      className="input input-bordered"
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>

          {/* Backdrop */}
          <div
            className="modal-backdrop"
            onClick={() => setIsOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
