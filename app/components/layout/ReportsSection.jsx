"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactionsStore } from "@/app/stores/useTransactionsStore";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import clsx from "clsx";
import ExpensesTab from "../helper/ExpensesTab";

export default function ReportsAnalytics() {
  const {
    transactions,
    installments,
    fetchAllPayments,
    deletePayment,
    loading,
    expenses,
  } = useTransactionsStore();

  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [activeTab, setActiveTab] = useState("Sales");

  useEffect(() => {
    fetchAllPayments(); // fetch all transactions + installments
  }, [fetchAllPayments]);

  // 🧾 Combine all transactions
  const allPayments = useMemo(() => {
    const combined = [
      ...transactions.map((t) => ({
        id: t.$id,
        type: "Full",
        amount: parseFloat(t.totalAmount || 0),
        date: new Date(t.$createdAt),
        patientId: t.patientId || "N/A",
        patientName: t.patientName,
      })),
      ...installments.map((i) => ({
        id: i.$id,
        type: "Installment",
        amount: parseFloat(i.amount || 0),
        date: new Date(i.dateTransact || i.$createdAt),
        patientId: i.patientId || "N/A",
        patientName: t.patientName,
      })),
    ];

    // Filter by date range
    return combined
      .filter((p) => {
        if (!dateRange.from && !dateRange.to) return true;
        const date = p.date.getTime();
        const from = dateRange.from
          ? new Date(dateRange.from).getTime()
          : -Infinity;
        const to = dateRange.to ? new Date(dateRange.to).getTime() : Infinity;
        return date >= from && date <= to;
      })
      .sort((a, b) => b.date - a.date); // newest first
  }, [transactions, installments, dateRange]);

  // 📊 Calculations
  const totalSales = allPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalInstallments = allPayments
    .filter((p) => p.type === "Installment")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalFull = allPayments
    .filter((p) => p.type === "Full")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = 0; // placeholder
  const netRevenue = totalSales - totalExpenses;

  // 🗑️ Delete handler with confirmation
  const handleDelete = (payment) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${payment.type.toLowerCase()} transaction?`
      )
    ) {
      deletePayment(payment.id, payment.type);
    }
  };

  // 📄 Export PDF Function
  // call this from your component (e.g. onClick of Download PDF)
  const handleExportPDF = async () => {
    try {
      // dynamic import (safe for Next.js client-side only)
      const { jsPDF } = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // normalize the autotable export (support default and named export)
      const autoTableFn = autoTableModule?.default ?? autoTableModule;

      // helper that calls plugin in both forms
      const callAutoTable = (options) => {
        // 1) if the module exported a function: autoTable(doc, opts)
        if (typeof autoTableFn === "function") {
          autoTableFn(doc, options);
          return true;
        }

        // 2) if plugin patched doc.autoTable
        if (typeof doc.autoTable === "function") {
          doc.autoTable(options);
          return true;
        }

        return false;
      };

      // header
      doc.setFontSize(16);
      doc.text("DentServe Reports & Analytics", 14, 15);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Report Type: ${activeTab} | Generated: ${new Date().toLocaleString()}`,
        14,
        22
      );

      // build table depending on activeTab
      if (activeTab === "Sales") {
        const head = [["Date", "Patient ID", "Type", "Amount"]];
        const body = allPayments.map((p) => [
          p.date.toLocaleDateString(),
          p.patientId ?? "N/A",
          p.type,
          `₱${p.amount.toLocaleString()}`,
        ]);

        const ok = callAutoTable({
          head,
          body,
          startY: 30,
          theme: "striped",
          headStyles: { fillColor: [34, 197, 94] }, // mint/green head
        });

        if (!ok) throw new Error("AutoTable plugin not available");

        // add summary under table
        const y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 30;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Summary", 14, y);
        doc.setFontSize(10);
        doc.text(`Total Revenue: ₱${totalSales.toLocaleString()}`, 14, y + 7);
        doc.text(`Full Payments: ₱${totalFull.toLocaleString()}`, 14, y + 14);
        doc.text(
          `Installments: ₱${totalInstallments.toLocaleString()}`,
          14,
          y + 21
        );
        doc.text(`Net Revenue: ₱${netRevenue.toLocaleString()}`, 14, y + 28);
      } else {
        // Expenses tab
        const head = [["Title", "Category", "Amount", "Date"]];
        const body = expenses.map((e) => [
          e.title || "—",
          e.category || "—",
          `₱${parseFloat(e.amount || 0).toLocaleString()}`,
          e.dateSpent ? new Date(e.dateSpent).toLocaleDateString() : "—",
        ]);

        const ok = callAutoTable({
          head,
          body,
          startY: 30,
          theme: "striped",
          headStyles: { fillColor: [34, 197, 94] },
        });

        if (!ok) throw new Error("AutoTable plugin not available");

        const totalExpenses = expenses.reduce(
          (s, ex) => s + parseFloat(ex.amount || 0),
          0
        );
        const y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 30;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Expenses: ₱${totalExpenses.toLocaleString()}`, 14, y);
      }

      // footer
      doc.setFontSize(9);
      doc.setTextColor(130);
      doc.text(`Generated by DentServe • ${new Date().getFullYear()}`, 14, 290);

      // save
      const safeDate = new Date().toISOString().slice(0, 10);
      doc.save(`DentServe_${activeTab}_Report_${safeDate}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to export PDF. See console for details.");
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-green-400 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-green-500">
            Reports & Analytics
          </h1>
          <p className="text-gray-500">
            View and filter all financial transactions.
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm px-4 py-2 rounded-lg shadow transition"
        >
          <FiDownload /> Download PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-green-200/50">
        {["Sales", "Expenses"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-4 py-2 font-semibold rounded-t-md transition",
              activeTab === tab
                ? "bg-green-500 text-white"
                : "text-green-600 hover:bg-green-100"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card border border-green-300/40 p-6 shadow-sm rounded-2xl bg-white">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2">
            <div>
              <label className="text-sm text-gray-600">From</label>
              <input
                type="date"
                className="input input-bordered input-sm w-full bg-white border-green-300"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">To</label>
              <input
                type="date"
                className="input input-bordered input-sm w-full bg-white border-green-300"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing:{" "}
            <span className="font-semibold text-green-600">
              {loading ? "Loading..." : "Sales " + allPayments.length}
            </span>{" "}
            <span className="font-semibold text-red-600">
              {loading ? "Loading..." : "Expense " + expenses.length}
            </span>{" "}
            records
          </div>
        </div>
      </div>

      {/* Sales Tab */}
      {activeTab === "Sales" ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat bg-white border border-green-300/40 rounded-xl p-5 shadow-sm">
              <div className="stat-title text-gray-600">Total Revenue</div>
              <div className="stat-value text-green-600 text-2xl font-bold">
                ₱{totalSales.toLocaleString()}
              </div>
            </div>

            <div className="stat bg-white border border-green-300/40 rounded-xl p-5 shadow-sm">
              <div className="stat-title text-gray-600">Full Payments</div>
              <div className="stat-value text-green-500 text-2xl font-bold">
                ₱{totalFull.toLocaleString()}
              </div>
            </div>

            <div className="stat bg-white border border-green-300/40 rounded-xl p-5 shadow-sm">
              <div className="stat-title text-gray-600">Installments</div>
              <div className="stat-value text-emerald-500 text-2xl font-bold">
                ₱{totalInstallments.toLocaleString()}
              </div>
            </div>

            <div className="stat bg-white border border-green-300/40 rounded-xl p-5 shadow-sm">
              <div className="stat-title text-gray-600">Net Revenue</div>
              <div className="stat-value text-mint-600 text-2xl font-bold">
                ₱{netRevenue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          {allPayments.length > 0 ? (
            <div className="card border border-green-300/40 shadow-sm rounded-xl overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="table">
                  <thead className="bg-white text-green-700">
                    <tr>
                      <th>Date</th>
                      <th>Patient Name</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-green-500">
                    {allPayments.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-green-50 transition text-gray-800"
                      >
                        <td>{p.date.toLocaleString()}</td>
                        <td>{p.patientName}</td>
                        <td>
                          <span
                            className={clsx(
                              "px-2 py-1 rounded-full text-xs font-semibold",
                              p.type === "Full"
                                ? "bg-green-100 text-green-700"
                                : "bg-emerald-100 text-emerald-700"
                            )}
                          >
                            {p.type}
                          </span>
                        </td>
                        <td className="font-medium text-200-600">
                          ₱{p.amount.toLocaleString()}
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => handleDelete(p)}
                            className="text-red-500 hover:text-red-600 transition hover:cursor-pointer"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-4 p-4">
                {allPayments.map((p) => (
                  <div
                    key={p.id}
                    className="border border-green-200 bg-green-50/30 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          p.type === "Full"
                            ? "bg-green-100 text-green-700"
                            : "bg-emerald-100 text-emerald-700"
                        )}
                      >
                        {p.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {p.date.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-green-700 font-semibold text-lg">
                      ₱{p.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      Patient: {p.patientId}
                    </div>
                    <button
                      onClick={() => handleDelete(p)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !loading && (
              <div className="text-center text-gray-500 italic border border-green-200 p-6 rounded-lg">
                No transactions found in this range.
              </div>
            )
          )}
        </>
      ) : (
        // Placeholder for Expenses
        <ExpensesTab />
      )}
    </div>
  );
}
