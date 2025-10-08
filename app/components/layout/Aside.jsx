"use client";

import { usePersonalizationStore } from "@/app/stores/usePersonalizationStore";
import { useEffect } from "react";
import {
  FiHome,
  FiBriefcase,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

export default function Sidebar() {
  const { personalization, fetchPersonalization } = usePersonalizationStore();

  useEffect(() => {
    fetchPersonalization();
  }, []);
  return (
    <div className="drawer-side">
      <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
      <aside className="w-64 bg-base-200 h-full flex flex-col">
        {/* Logo / Brand */}
        <div className="p-4 border-b border-base-300">
          <h2 className="text-2xl font-bold text-primary">
            {personalization?.businessName} dsds
          </h2>
        </div>

        {/* Navigation */}
        <ul className="menu flex-1 p-4 gap-2 text-base">
          <li>
            <a className="active flex items-center gap-3">
              <FiHome /> Dashboard
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3">
              <FiBriefcase /> My Clinic
            </a>
          </li>
          <li>
            <details className="collapse collapse-arrow">
              <summary className="collapse-title flex items-center gap-3">
                <FiCalendar /> Appointments
              </summary>
              <ul className="collapse-content ml-6">
                <li>
                  <a>Upcoming</a>
                </li>
                <li>
                  <a>Completed</a>
                </li>
                <li>
                  <a>Cancelled</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a className="flex items-center gap-3">
              <FiUsers /> Patients
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3">
              <FiDollarSign /> Finance
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3">
              <FiShoppingCart /> Expenses
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3">
              <FiBarChart2 /> Reports
            </a>
          </li>
        </ul>

        {/* Footer */}
        <div className="p-4 border-t border-base-300">
          <ul className="menu">
            <li>
              <a className="flex items-center gap-3">
                <FiSettings /> Settings
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
