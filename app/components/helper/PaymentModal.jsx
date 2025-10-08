"use client";

import { useEffect, useState } from "react";
import { databases, ID } from "../../lib/appwrite";
import { Query } from "appwrite";
import { X, Plus } from "lucide-react";
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
  const [selectedInstallment, setSelectedInstallment] = useState(null);

  // Fetch transactions
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

  useEffect(() => {
    if (isOpen && patient?.$id) fetchTransactions();
  }, [isOpen, patient]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3">
      <div className="bg-white w-full sm:w-[85vw] md:w-[70vw] lg:w-[60vw] max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-mint-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-green-600 to-mint-500 text-white">
          <h2 className="text-lg font-semibold truncate">
            Transactions for{" "}
            <span className="font-bold text-yellow-200">
              {patient?.patientName}
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenNewModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition text-sm"
            >
              <Plus size={16} /> New Transaction
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 p-5 bg-mint-50 border-b border-mint-200 text-center">
          <div>
            <p className="text-xs text-green-700 uppercase">Total Paid</p>
            <p className="text-xl font-bold text-green-600">
              ₱{summary.totalPaid.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-green-700 uppercase">Remaining</p>
            <p className="text-xl font-bold text-yellow-600">
              ₱{summary.totalRemaining.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-green-700 uppercase">Transactions</p>
            <p className="text-xl font-bold text-green-500">
              {transactions.length}
            </p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto p-5 bg-white">
          {loading ? (
            <p className="text-center text-green-600 py-8 animate-pulse">
              Loading transactions...
            </p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No transactions found.
            </p>
          ) : (
            <ul className="space-y-3">
              {transactions.map((t) => (
                <li
                  key={t.$id}
                  className="p-4 bg-mint-50 border border-mint-200 rounded-xl hover:border-green-400 hover:bg-mint-100 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-green-700">
                        {t.serviceName || "Unnamed Service"}
                      </h3>
                      <p className="text-xs text-green-600">
                        {t.paymentType || "Transaction"} —{" "}
                        {dayjs(t.dateTransact || t.$createdAt).format(
                          "MMM D, YYYY"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">
                        ₱{Number(t.paid || 0).toLocaleString()}
                      </p>
                      {t.remaining > 0 ? (
                        <p className="text-xs text-green-700">
                          Remaining: ₱{Number(t.remaining).toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-xs text-green-500">
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
                        className="text-sm text-green-600 hover:underline"
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
        <div className="border-t border-mint-200 p-4 bg-mint-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
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
