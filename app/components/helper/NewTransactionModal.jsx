"use client";

import { useState, useEffect } from "react";
import { databases, ID } from "../../lib/appwrite";
import { X } from "lucide-react";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_TRANSACTIONS = "transactions";
const COLLECTION_SERVICES = "services";

export default function NewTransactionModal({ patient, onClose, onSaved }) {
  const [form, setForm] = useState({
    serviceId: "",
    serviceName: "",
    servicePrice: 0,
    totalAmount: "",
    paymentType: "",
    initialPay: "",
    paid: 0,
    status: "unpaid",
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load available services from Appwrite
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_SERVICES
        );
        setServices(res.documents);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  // 🔹 Handle service change
  const handleServiceChange = (e) => {
    const selectedId = e.target.value;
    const selectedService = services.find((s) => s.$id === selectedId);

    setForm((prev) => ({
      ...prev,
      serviceId: selectedService?.$id || "",
      serviceName: selectedService?.serviceName || "",
      servicePrice: Number(selectedService?.servicePrice) || 0,
      totalAmount: Number(selectedService?.servicePrice) || "",
    }));
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Compute remaining balance
  const remainingBalance =
    form.paymentType === "installment"
      ? Math.max(form.servicePrice - Number(form.initialPay || 0), 0)
      : 0;

  // 🔹 Handle form submission — always CREATE new record
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine how much is paid upfront
      const paidAmount =
        form.paymentType === "installment"
          ? Number(form.initialPay || 0)
          : Number(form.totalAmount || 0);

      // Determine status
      const statusValue =
        paidAmount >= form.servicePrice
          ? "paid"
          : form.paymentType === "installment"
          ? "ongoing"
          : "unpaid";

      // Create new transaction record in Appwrite
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_TRANSACTIONS,
        ID.unique(),
        {
          patientId: patient?.$id,
          totalAmount: Number(form.servicePrice),
          serviceName: form.serviceName,
          serviceId: form.serviceId,
          paymentType: form.paymentType,
          paid: paidAmount,
          status: statusValue,
        }
      );

      onSaved?.(); // refresh list
      onClose();
    } catch (err) {
      console.error("Error creating transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-base-100 dark:bg-gray-900 w-full max-w-md p-8 rounded-2xl h-full shadow-2xl border border-gray-700 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-primary">New Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 h-full">
          {/* Service Selection */}
          <div>
            <label className="block text-sm mb-1 font-medium">Service</label>
            <select
              name="serviceId"
              value={form.serviceId}
              onChange={handleServiceChange}
              className="border border-gray-600 bg-transparent rounded-lg px-3 py-2 w-full"
              required
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.$id} value={s.$id}>
                  {s.serviceName} - ₱{s.servicePrice}
                </option>
              ))}
            </select>
          </div>

          {/* Service Price */}
          {form.servicePrice > 0 && (
            <div className="text-sm text-gray-400">
              Service Price:{" "}
              <span className="font-semibold text-white">
                ₱{Number(form.servicePrice).toLocaleString()}
              </span>
            </div>
          )}

          {/* Payment Type */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              Payment Type
            </label>
            <select
              name="paymentType"
              value={form.paymentType}
              onChange={handleChange}
              className="border border-gray-600 bg-transparent rounded-lg px-3 py-2 w-full"
              required
            >
              <option value="">Select type</option>
              <option value="full">Full Payment</option>
              <option value="installment">Installment</option>
            </select>
          </div>

          {/* Initial Pay (only if installment) */}
          {form.paymentType === "installment" && (
            <>
              <div>
                <label className="block text-sm mb-1 font-medium">
                  Initial Payment (₱)
                </label>
                <input
                  type="number"
                  name="initialPay"
                  value={form.initialPay || ""}
                  onChange={handleChange}
                  placeholder="Enter initial amount"
                  className="border border-gray-600 bg-transparent rounded-lg px-3 py-2 w-full"
                  required
                />
              </div>

              <div className="text-sm text-gray-400 mt-1">
                Remaining Balance:{" "}
                <span className="font-semibold text-warning">
                  ₱{remainingBalance.toLocaleString()}
                </span>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg text-white"
            >
              {loading ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
