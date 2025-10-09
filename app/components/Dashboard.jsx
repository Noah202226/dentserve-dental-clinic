"use client";

import { useEffect, useState } from "react";
import {
  FiHome,
  FiDollarSign,
  FiUsers,
  FiSettings,
  FiBarChart2,
} from "react-icons/fi";
import TopBar from "./layout/TopBar";
import DashboardSection from "./layout/DashboardSection";
import PatientsSection from "./layout/PatientsSection";
import ReportsSection from "./layout/ReportsSection";
import SettingsSection from "./layout/SettingsSection";
import SalesSection from "./layout/SalesSection";
import { usePersonalizationStore } from "../stores/usePersonalizationStore";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("patients");

  const { personalization, fetchPersonalization } = usePersonalizationStore();

  const mockStats = {
    totalPatients: 1245,
    newPatients: 23,
    activeTreatments: 87,
    revenueMonth: 452000,
    revenueGrowth: 8,
    outstandingBalance: 35700,
  };

  const mockTopServices = [
    { name: "Teeth Cleaning", count: 320 },
    { name: "Braces", count: 150 },
    { name: "Tooth Extraction", count: 110 },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardSection stats={mockStats} topServices={mockTopServices} />
        );
      case "sales":
        return <SalesSection />;
      case "patients":
        return <PatientsSection />;
      case "reports":
        return <ReportsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  // 🌿 Light theme link styles
  const getLinkClasses = (section) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
      activeSection === section
        ? "bg-green-600 text-white font-semibold shadow-md"
        : "text-gray-700 hover:bg-green-100 hover:text-green-700"
    }`;

  useEffect(() => {
    fetchPersonalization();
  }, []);
  return (
    <div className="drawer lg:drawer-open bg-white text-gray-800">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        <TopBar />

        <div className="flex-1 overflow-y-auto bg-white">{renderSection()}</div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-64 bg-white border-r border-green-100 shadow-sm flex flex-col">
          {/* Logo */}
          <div className="p-5 border-b border-green-100">
            <h2 className="text-2xl font-bold text-green-600">
              {personalization?.businessName}
            </h2>
          </div>

          {/* Sidebar Menu */}
          <div className="flex-1 overflow-y-auto">
            <ul className="menu p-4  gap-2 uppercase text-gray-500 text-sm tracking-wide">
              <li className="menu-title text-green-900 font-semibold">
                Management
              </li>
              <li>
                <a
                  className={getLinkClasses("patients")}
                  onClick={() => setActiveSection("patients")}
                >
                  <FiUsers /> Patients
                </a>
              </li>
            </ul>

            <ul className="menu p-4 gap-2 uppercase text-gray-500 text-sm tracking-wide">
              <li className="menu-title text-green-900 font-semibold">
                Reports
              </li>
              <li>
                <a
                  className={getLinkClasses("reports")}
                  onClick={() => setActiveSection("reports")}
                >
                  <FiBarChart2 /> Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Footer / Settings */}
          <div className="p-4 border-t border-green-100 bg-white">
            <ul className="menu">
              <li className="menu-title text-green-900 font-semibold">
                System
              </li>
              <li>
                <a
                  className={getLinkClasses("settings")}
                  onClick={() => setActiveSection("settings")}
                >
                  <FiSettings /> Settings
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
