"use client";
import { useState, useEffect } from "react";
import { usePaymentStore } from "../../stores/usePaymentStore";
import dayjs from "dayjs";

export default function PaymentModal({ patientId, onClose }) {
  const {
    loading,
    transactions,
    installments,
    fetchPayments,
    addTransaction,
    addInstallment,
  } = usePaymentStore();
  const [activeTab, setActiveTab] = useState("full");
  const [amount, setAmount] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (patientId) fetchPayments(patientId);
  }, [patientId]);

  const handleAdd = async () => {
    if (!amount.trim()) return;
    setAdding(true);
    try {
      if (activeTab === "full") {
        // Save full payment only in transactions
        await addTransaction(patientId, amount, "Full Payment");
      } else {
        // Save in both transactions + installments
        await addTransaction(patientId, amount, "Installment");
        await addInstallment(patientId, amount, new Date().toISOString());
      }
      setAmount("");
      await fetchPayments(patientId); // refresh list
    } catch (err) {
      console.error("Error adding payment:", err);
    }
    setAdding(false);
  };

  const renderList = (data) => {
    if (loading)
      return [...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse bg-base-200 h-14 rounded-md" />
      ));
    if (!data?.length)
      return (
        <p className="text-gray-400 text-sm text-center py-6">
          No {activeTab === "full" ? "payments" : "installments"} yet.
        </p>
      );
    return data.map((p) => (
      <div
        key={p.$id}
        className="flex justify-between items-center bg-base-200 rounded-md p-3"
      >
        <span className="font-medium">₱{parseFloat(p.amount).toFixed(2)}</span>
        <span className="text-xs opacity-70">
          {p.dateTransact
            ? dayjs(p.dateTransact).format("MMM D, YYYY")
            : dayjs(p.$createdAt).format("MMM D, YYYY")}
        </span>
      </div>
    ));
  };

  return (
    <dialog open className="modal modal-open z-[1000]">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h3 className="font-bold text-lg">Payments</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" className="tabs tabs-boxed mb-4">
          <button
            role="tab"
            className={`tab ${activeTab === "full" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("full")}
          >
            Full Payments
          </button>
          <button
            role="tab"
            className={`tab ${
              activeTab === "installments" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("installments")}
          >
            Installments
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
          {activeTab === "full"
            ? renderList(transactions)
            : renderList(installments)}
        </div>

        {/* Add Payment */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            className="input input-bordered w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className={`btn btn-primary ${adding ? "loading" : ""}`}
            disabled={adding || loading}
          >
            Add
          </button>
        </div>

        {/* Footer */}
        <div className="modal-action mt-4">
          <button onClick={onClose} className="btn btn-neutral">
            Close
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
