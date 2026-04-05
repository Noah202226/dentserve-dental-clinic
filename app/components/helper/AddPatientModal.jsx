"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
    age: "",
    contact: "",
    emergencyToContact: "",
    emergencyToContactNumber: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.patientName) {
      toast.error("Please fill in the required fields: Patient Name");
      return;
    }
    onSave(form);
    // reset state
    setForm({
      patientName: "",
      address: "",
      birthdate: "",
      gender: "",
      age: "",
      contact: "",
      emergencyToContact: "",
      emergencyToContactNumber: "",
      note: "",
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setForm({
        patientName: "",
        address: "",
        birthdate: "",
        gender: "",
        age: "",
        contact: "",
        emergencyToContact: "",
        emergencyToContactNumber: "",
        note: "",
      });
    }
  }, [isOpen]);

  return (
    <>
      <dialog
        id="add_patient_modal"
        className={`modal ${isOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box max-w-3xl bg-white text-gray-800 rounded-2xl shadow-2xl border border-[#B3E6C2]">
          <h3 className="font-bold text-2xl mb-4 text-black flex items-center gap-2">
            🧾 Add New Patient
          </h3>

          {/* Tabs */}
          <div
            role="tablist"
            className="tabs  bg-[#C9FDD7]/70 mb-5 rounded-xl peer-checked: text-red-500"
          >
            {/* General Info */}
            <input
              type="radio"
              name="tabset"
              role="tab"
              className="tab text-green-500 font-semibold peer-checked:bg-red-500 peer-checked:text-black rounded-xl"
              aria-label="General Infos"
              defaultChecked
              id="tab-general"
            />
            <div
              role="tabpanel"
              className="tab-content p-4 bg-[#E9FFF0] rounded-xl text-black"
              htmlFor="tab-general"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Enter full name"
                    value={form.patientName}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-[#D9FFE5] border-[#B3E6C2] text-gray-800 rounded-xl"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-[#D9FFE5] border-[#B3E6C2] text-gray-800 rounded-xl"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">Age</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    className="input input-bordered w-full  bg-[#D9FFE5] border-[#B3E6C2] text-gray-800 rounded-xl"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">Birthdate</span>
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={form.birthdate}
                    onChange={handleChange}
                    className="input input-bordered w-full  bg-[#D9FFE5] border-[#B3E6C2] text-gray-800 rounded-xl"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">
                      Contact Number
                    </span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    placeholder="Enter contact number"
                    value={form.contact}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-[#D9FFE5] border-[#B3E6C2] text-gray-800 rounded-xl"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-700">Address</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={form.address}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-[#D9FFE5] border-[#B3E6C2] text-gray-800 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Info */}
            <input
              type="radio"
              name="tabset"
              role="tab"
              className="tab font-semibold text-amber-950 peer-checked:bg-green-500 peer-checked:text-white rounded-xl"
              aria-label="Emergency"
              id="tab-emergency"
            />
            <div
              role="tabpanel"
              className="tab-content p-4 bg-[#E9FFF0] rounded-xl"
              htmlFor="tab-emergency"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">
                      Emergency Contact Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="emergencyToContact"
                    placeholder="Enter emergency contact name"
                    value={form.emergencyToContact}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-[#D9FFE5] border-[#B3E6C2] text-gray-800 rounded-xl"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">
                      Emergency Contact Number
                    </span>
                  </label>
                  <input
                    type="text"
                    name="emergencyToContactNumber"
                    placeholder="Enter emergency number"
                    value={form.emergencyToContactNumber}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-[#D9FFE5] border-[#B3E6C2] text-gray-800 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <input
              type="radio"
              name="tabset"
              role="tab"
              className="tab text-green-500 font-semibold"
              aria-label="Note"
              id="tab-note"
            />
            <div
              role="tabpanel"
              className="tab-content p-4 bg-[#E9FFF0] rounded-xl"
              htmlFor="tab-note"
            >
              <label className="label">
                <span className="label-text text-gray-700">
                  Additional Notes
                </span>
              </label>
              <textarea
                name="note"
                placeholder="Enter any important notes..."
                value={form.note}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-32 bg-[#D9FFE5] border-[#B3E6C2] text-gray-800 rounded-xl"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-3">
            <button
              className="btn btn-outline border-[#B3E6C2] text-gray-700 hover:bg-[#D9FFE5] rounded-xl"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className={`btn bg-green-500 hover:bg-green-400 text-white border-none rounded-xl shadow-md ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
              }`}
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
