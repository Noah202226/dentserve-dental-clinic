"use client";

import { useState } from "react";
import { FiLoader } from "react-icons/fi";

export default function AddPatientModal({
  isOpen,
  setIsOpen,
  onSave,
  loading,
}) {
  const [form, setForm] = useState({
    patientName: "",
    address: "",
    birthdate: "",
    gender: "",
    contact: "",
    emergencyToContact: "",
    emergencyToContactNumber: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.patientName || !form.contact) return;
    onSave(form);
  };

  return (
    <>
      <dialog
        id="add_patient_modal"
        className={`modal ${isOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box max-w-3xl bg-base-200 text-base-content rounded-2xl shadow-2xl border border-base-300">
          <h3 className="font-bold text-2xl mb-4 text-primary flex items-center gap-2">
            🧾 Add New Patient
          </h3>

          {/* Tabs */}
          <div role="tablist" className="tabs tabs-boxed bg-base-300 mb-5">
            <input
              type="radio"
              name="tabset"
              role="tab"
              className="tab"
              aria-label="General Info"
              defaultChecked
              id="tab-general"
            />
            <div
              role="tabpanel"
              className="tab-content p-4 bg-base-200"
              htmlFor="tab-general"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text text-gray-300">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Enter full name"
                    value={form.patientName}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-base-300"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-gray-300">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-base-300"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-gray-300">Birthdate</span>
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={form.birthdate}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-base-300"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-gray-300">
                      Contact Number
                    </span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    placeholder="Enter contact number"
                    value={form.contact}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-base-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-300">Address</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={form.address}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-base-300"
                  />
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="tabset"
              role="tab"
              className="tab"
              aria-label="Emergency"
              id="tab-emergency"
            />
            <div
              role="tabpanel"
              className="tab-content p-4 bg-base-200"
              htmlFor="tab-emergency"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text text-gray-300">
                      Emergency Contact Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="emergencyToContact"
                    placeholder="Enter emergency contact name"
                    value={form.emergencyToContact}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-base-300"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-gray-300">
                      Emergency Contact Number
                    </span>
                  </label>
                  <input
                    type="text"
                    name="emergencyToContactNumber"
                    placeholder="Enter emergency number"
                    value={form.emergencyToContactNumber}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-base-300"
                  />
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="tabset"
              role="tab"
              className="tab"
              aria-label="Note"
              id="tab-note"
            />
            <div
              role="tabpanel"
              className="tab-content p-4 bg-base-200"
              htmlFor="tab-note"
            >
              <label className="label">
                <span className="label-text text-gray-300">
                  Additional Notes
                </span>
              </label>
              <textarea
                name="note"
                placeholder="Enter any important notes..."
                value={form.note}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-32 bg-base-300"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-3">
            <button
              className="btn btn-ghost"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
              onClick={handleSave}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
}
