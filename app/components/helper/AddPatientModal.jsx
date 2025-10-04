"use client";

import { FiClipboard } from "react-icons/fi";
import { useState } from "react";

export default function AddPatientModal({ isOpen, setIsOpen, onSave }) {
  const [formData, setFormData] = useState({
    activeTab: "general",
    name: "",
    age: "",
    contact: "",
    dateAdded: "",
    medicalHistory: "",
    treatmentPlan: "",
    notes: "",
    prescriptions: "",
    payments: "",
    balance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // pass back to parent
    setFormData({
      activeTab: "general",
      name: "",
      age: "",
      contact: "",
      dateAdded: "",
      medicalHistory: "",
      treatmentPlan: "",
      notes: "",
      prescriptions: "",
      payments: "",
      balance: "",
    });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
          <FiClipboard /> Add New Patient
        </h3>

        {/* Tabs */}
        <div role="tablist" className="tabs tabs-boxed mb-4">
          {["general", "medical", "financial"].map((tab) => (
            <button
              key={tab}
              role="tab"
              className={`tab ${
                formData.activeTab === tab ? "tab-active" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, activeTab: tab }))
              }
            >
              {tab === "general"
                ? "General Info"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* General Info */}
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

          {/* Medical */}
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
            </div>
          )}

          {/* Financial */}
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

          {/* Actions */}
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
    </div>
  );
}
