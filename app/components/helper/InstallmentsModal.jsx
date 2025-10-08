"use client";

import { useEffect, useState } from "react";
import { databases, ID } from "../../lib/appwrite";
import { Query } from "appwrite";
import { X, Plus } from "lucide-react";
import dayjs from "dayjs";

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_INSTALLMENTS = "installments";
const COLLECTION_TRANSACTIONS = "transactions";

export default function InstallmentsModal({ transaction, onClose }) {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ amount: "", note: "" });

  const fetchInstallments = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_INSTALLMENTS,
        [
          Query.equal("transactionId", transaction.$id),
          Query.orderDesc("$createdAt"),
        ]
      );
      setInstallments(res.documents);
    } catch (err) {
      console.error("Error fetching installments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (transaction?.$id) {
      fetchInstallments();
    }
  }, [transaction]);

  // Compute remaining balance
  const totalPaid = installments.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );
  const remaining = Math.max(transaction.totalAmount - totalPaid, 0);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new payment submit
  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!form.amount) return;

    const newPaid = Number(form.amount);
    const newRemaining = Math.max(remaining - newPaid, 0);

    try {
      setAdding(true);
      // Save to installments table
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_INSTALLMENTS,
        ID.unique(),
        {
          transactionId: transaction.$id,
          amount: newPaid,
          dateTransact: new Date().toISOString(),
          remaining: newRemaining,
          serviceName: transaction.serviceName,
          note: form.note,
        }
      );

      // Update main transaction record
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_TRANSACTIONS,
        transaction.$id,
        {
          paid: totalPaid + newPaid,
          remaining: newRemaining,
          status: newRemaining <= 0 ? "paid" : "ongoing",
        }
      );

      // Reset form and refresh data
      setForm({ amount: "", note: "" });
      await fetchInstallments();
    } catch (err) {
      console.error("Error adding installment:", err);
    } finally {
      setAdding(false);
    }
  };

  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex justify-center items-center">
      <div className=" dark:bg-gray-900 w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-green-500">
            Installments for {transaction.serviceName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-green-400"
          >
            <X size={22} />
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 text-center border-b border-gray-300 p-3 bg-base-100 dark:bg-gray-800">
          <div>
            <p className="text-xs text-gray-400 uppercase">Total</p>
            <p className="text-sm font-semibold text-green-300">
              ₱{Number(transaction.totalAmount).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Paid</p>
            <p className="text-sm font-semibold text-green-400">
              ₱{totalPaid.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Remaining</p>
            <p className="text-sm font-semibold text-red-400">
              ₱{remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* List */}
        <div className="p-5 max-h-[40vh] overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-400">Loading installments...</p>
          ) : installments.length === 0 ? (
            <p className="text-center text-gray-400">
              No installment records yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {installments.map((i) => (
                <li
                  key={i.$id}
                  className="bg-base-200 dark:bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-green-400 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-green-300">
                        ₱{Number(i.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {dayjs(i.dateTransact).format("MMM D, YYYY")}
                      </p>
                    </div>
                    {i.remaining !== undefined && (
                      <p className="text-xs text-red-400">
                        Remaining: ₱{Number(i.remaining).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {i.note && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      {i.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Payment Form */}
        {remaining > 0 ? (
          <div className="border-t border-gray-700 p-4">
            <form onSubmit={handleAddPayment} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter payment amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="border border-green-600 bg-transparent rounded-lg px-3 py-2 w-full focus:border-green-400"
                  required
                  min="1"
                  max={remaining}
                />
                <button
                  type="submit"
                  disabled={adding}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition"
                >
                  <Plus size={16} /> {adding ? "Adding..." : "Add"}
                </button>
              </div>
              <textarea
                name="note"
                placeholder="Optional note"
                value={form.note}
                onChange={handleChange}
                className="border border-green-600 bg-transparent rounded-lg px-3 py-2 text-sm focus:border-green-400"
              ></textarea>
            </form>
          </div>
        ) : (
          <p className="border-t border-gray-700 bg-transparent px-3 py-3 text-sm text-center text-green-400">
            ✅ Payment Completed
          </p>
        )}
      </div>
    </div>
  );
}
