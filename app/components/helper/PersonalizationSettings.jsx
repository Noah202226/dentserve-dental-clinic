"use client";

import { useEffect, useState } from "react";
import { usePersonalizationStore } from "@/app/stores/usePersonalizationStore";
import { Loader2, Save } from "lucide-react";

export default function PersonalizationSettings() {
  const {
    personalization,
    fetchPersonalization,
    savePersonalization,
    loading,
  } = usePersonalizationStore();

  // Updated state to include address and email
  const [form, setForm] = useState({
    businessName: "",
    initial: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    fetchPersonalization();
  }, []);

  useEffect(() => {
    if (personalization) {
      setForm({
        businessName: personalization.businessName || "",
        initial: personalization.initial || "",
        address: personalization.address || "",
        email: personalization.email || "",
      });
    }
  }, [personalization]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await savePersonalization(form);
  };

  if (loading && !personalization)
    return (
      <div className="flex justify-center items-center py-10 text-[var(--theme-color)]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading settings...
      </div>
    );

  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-[var(--theme-color)] mb-4">
        Personalization
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Customize your clinic information that appears across the app and on
        generated PDFs.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Business Name
          </label>
          <input
            type="text"
            className="input input-bordered text-[var(--theme-color)] bg-white w-full border-green-300"
            placeholder="e.g. Senoto Dental Care"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            required
          />
        </div>

        {/* Clinic Address */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Clinic Address
          </label>
          <input
            type="text"
            className="input input-bordered text-[var(--theme-color)] bg-white w-full border-green-300"
            placeholder="e.g. 123 Smile Avenue, Dental City, 12345"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </div>

        {/* Clinic Email */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="input input-bordered text-[var(--theme-color)] bg-white w-full border-green-300"
            placeholder="e.g. info@yourclinic.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        {/* Initial */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Initial</label>
          <input
            type="text"
            maxLength={2}
            className="input input-bordered text-[var(--theme-color)] bg-white w-full border-green-300"
            placeholder="e.g. SDC"
            value={form.initial}
            onChange={(e) => setForm({ ...form, initial: e.target.value })}
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Shown in app headers or branding.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow mt-4 transition-all"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save size={16} />
          {personalization ? "Update Settings" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
