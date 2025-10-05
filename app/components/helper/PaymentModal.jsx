"use client";

import { useEffect, useState } from "react";
import { databases, ID } from "../../lib/appwrite";
import { Query } from "appwrite";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import NewTransactionModal from "./NewTransactionModal";
import InstallmentsModal from "./InstallmentsModal";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_TRANSACTIONS = "transactions";

export default function PaymentModal({ isOpen, onClose, patient }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ totalPaid: 0, totalRemaining: 0 });
  const [openNewModal, setOpenNewModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedInstallment, setSelectedInstallment] = useState(null);

  // 🔹 Fetch transactions
  const fetchTransactions = async () => {
    if (!patient?.$id) return;
    try {
      setLoading(true);
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_TRANSACTIONS,
        [Query.equal("patientId", patient.$id), Query.orderDesc("$createdAt")]
      );

      const docs = res.documents;
      const totalPaid = docs.reduce((sum, t) => sum + Number(t.paid || 0), 0);
      const totalRemaining = docs.reduce(
        (sum, t) => sum + Number(t.remaining || 0),
        0
      );

      setTransactions(docs);
      setSummary({ totalPaid, totalRemaining });
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete a transaction
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await databases.deleteDocument(DATABASE_ID, COLLECTION_TRANSACTIONS, id);
      setTransactions((prev) => prev.filter((t) => t.$id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
      alert("Failed to delete transaction.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (isOpen && patient?.$id) {
      fetchTransactions();
    }
  }, [isOpen, patient]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 h-[75vh] w-[80vw] dark:bg-gray-900 rounded-2xl shadow-2xl overflow-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-lg font-bold">
            Transactions for{" "}
            <span className="text-primary">{patient?.patientName}</span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenNewModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/80 transition text-sm"
            >
              <Plus size={16} /> New Transaction
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 p-5 border-b border-gray-700 bg-base-200 dark:bg-gray-800 text-center rounded-t-lg">
          <div>
            <p className="text-xs text-gray-400 uppercase">Total Paid</p>
            <p className="text-xl font-bold text-success">
              ₱{summary.totalPaid.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Remaining</p>
            <p className="text-xl font-bold text-warning">
              ₱{summary.totalRemaining.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Transactions</p>
            <p className="text-xl font-bold text-info">{transactions.length}</p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="p-5 max-h-[40vh] overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-400 py-8 animate-pulse">
              Loading transactions...
            </p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No transactions found.
            </p>
          ) : (
            <ul className="space-y-3">
              {transactions.map((t) => (
                <li
                  key={t.$id}
                  className="bg-base-200 dark:bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-primary transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-base">
                        {t.serviceName || "Unnamed Service"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {t.paymentType || "Transaction"} —{" "}
                        {dayjs(t.dateTransact || t.$createdAt).format(
                          "MMM D, YYYY"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        ₱{Number(t.paid || 0).toLocaleString()}
                      </p>
                      {t.remaining > 0 ? (
                        <p className="text-xs text-gray-400">
                          Remaining: ₱{Number(t.remaining).toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-xs text-green-400">
                          (PAID) Remaining: ₱
                          {Number(t.remaining).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Installment View Button */}
                  {t.paymentType === "installment" && (
                    <div className="mt-2 text-right">
                      <button
                        onClick={() => setSelectedInstallment(t)}
                        className="text-sm text-primary hover:underline"
                      >
                        View Installments
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* New Transaction Modal */}
      {openNewModal && (
        <NewTransactionModal
          patient={patient}
          onClose={() => setOpenNewModal(false)}
          onSaved={fetchTransactions}
          mainTransactionId={patient?.$id}
        />
      )}

      {selectedInstallment && (
        <InstallmentsModal
          transaction={selectedInstallment}
          onClose={() => setSelectedInstallment(null)}
        />
      )}
    </div>
  );
}
