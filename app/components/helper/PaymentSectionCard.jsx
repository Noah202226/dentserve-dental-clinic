"use client";
import { useState } from "react";
import PaymentModal from "./PaymentModal"; // make sure filename matches

export default function PaymentSectionCard({ patient }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card View */}
      <div
        className="bg-base-200 p-4 rounded-xl hover:bg-base-300 transition cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Payments</h3>
        </div>
        <p className="text-sm text-gray-400">View and manage payments</p>
      </div>

      {/* Modal */}
      <PaymentModal
        isOpen={open}
        onClose={() => setOpen(false)}
        patient={patient}
      />
    </>
  );
}
