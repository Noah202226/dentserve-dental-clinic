"use client";

import { useState } from "react";
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

// Example section components

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const mockStats = {
    totalPatients: 1245,
    newPatients: 23,
    activeTreatments: 87,
    revenueMonth: 452000,
    revenueGrowth: 8, // positive = green, negative = red
    outstandingBalance: 35700,
  };

  const mockTopServices = [
    { name: "Teeth Cleaning", count: 320 },
    { name: "Braces", count: 150 },
    { name: "Tooth Extraction", count: 110 },
  ];
  // Pick the section dynamically
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

  // 🔥 utility to build active link style
  const getLinkClasses = (section) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
      activeSection === section
        ? "bg-primary text-primary-content font-semibold shadow"
        : "hover:bg-base-300"
    }`;

  return (
    <div className="drawer lg:drawer-open h-screen">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content area */}
      <div className="drawer-content flex flex-col bg-base-100">
        {/* ✅ TopBar should live here so it aligns */}
        <TopBar />

        {/* Page content below TopBar */}
        <div className="flex-1 overflow-y-auto">{renderSection()}</div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-64 bg-base-200 h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-base-300">
            <h2 className="text-2xl font-bold text-primary">DentServe</h2>
          </div>

          {/* Sidebar Menus */}
          <div className="flex-1 overflow-y-auto">
            {/* Main Section */}
            <ul className="menu p-4 text-base gap-2">
              <li className="menu-title">Main</li>
              <li>
                <a
                  className={getLinkClasses("dashboard")}
                  onClick={() => setActiveSection("dashboard")}
                >
                  <FiHome /> Dashboard
                </a>
              </li>
              <li>
                <a
                  className={getLinkClasses("sales")}
                  onClick={() => setActiveSection("sales")}
                >
                  <FiDollarSign /> Sales
                </a>
              </li>
            </ul>

            {/* Management Section */}
            <ul className="menu p-4 text-base gap-2">
              <li className="menu-title">Management</li>
              <li>
                <a
                  className={getLinkClasses("patients")}
                  onClick={() => setActiveSection("patients")}
                >
                  <FiUsers /> Patients
                </a>
              </li>
            </ul>

            {/* Reports Section */}
            <ul className="menu p-4 text-base gap-2">
              <li className="menu-title">Reports</li>
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

          {/* Footer / System Section */}
          <div className="p-4 border-t border-base-300">
            <ul className="menu">
              <li className="menu-title">System</li>
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
