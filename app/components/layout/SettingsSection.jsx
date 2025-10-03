"use client";

import { useState } from "react";
import { FiUser, FiBell, FiMoon, FiSave, FiMail } from "react-icons/fi";

export default function SettingsSection() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [clinicName, setClinicName] = useState("NoaArc Dental Clinic");

  // Dummy user data (replace with store later)
  const user = {
    name: "Dr. John Doe",
    email: "dr.johndoe@example.com",
    role: "Administrator",
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">⚙️ Settings</h1>

      {/* User Profile Card */}
      {/* <div className="card bg-base-100 shadow-lg p-2 flex items-center gap-4">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-16">
            <span className="text-xl">{user.name.charAt(0)}</span>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-lg">{user.name}</h2>
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <FiMail /> {user.email}
          </p>
          <p className="text-xs text-gray-400">{user.role}</p>
        </div>
      </div> */}

      {/* Clinic Info */}
      <div className="card bg-base-100 shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiUser /> Clinic Information
        </h2>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Clinic Name</span>
          </div>
          <input
            type="text"
            className="input input-bordered"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
          />
        </label>
      </div>

      {/* Preferences */}
      <div className="card bg-base-100 shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Preferences</h2>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FiMoon /> Dark Mode
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FiBell /> Notifications
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn btn-primary flex items-center gap-2">
          <FiSave /> Save Changes
        </button>
      </div>
    </div>
  );
}
