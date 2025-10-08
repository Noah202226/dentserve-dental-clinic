"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Building2, MapPin, Save } from "lucide-react";

export default function DentistTab() {
  const [form, setForm] = useState({
    fullName: "Dr. Jane Doe",
    email: "dr.jane@example.com",
    phone: "+1 234 567 890",
    clinicName: "DentServe Dental Clinic",
    address: "123 Smile Street, Happyville",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Dentist profile saved successfully!");
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0f5132]/90 p-6 rounded-2xl text-white  mx-auto shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="w-6 h-6" /> Dentist Information ('Not Yet Working...')
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="input input-bordered w-full bg-white/90 text-black border-0 focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-200" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input input-bordered w-full bg-white/90 text-black border-0 focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-200" />
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input input-bordered w-full bg-white/90 text-black border-0 focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Clinic Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Clinic Name</label>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-green-200" />
            <input
              type="text"
              value={form.clinicName}
              onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
              className="input input-bordered w-full bg-white/90 text-black border-0 focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Clinic Address
          </label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-200" />
            <textarea
              rows="2"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="textarea textarea-bordered w-full bg-white/90 text-black border-0 focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 ${
            saving ? "loading" : ""
          }`}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}
