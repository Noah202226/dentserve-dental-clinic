"use client";

import {
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";

export default function DashboardSection({
  stats = {
    totalPatients: 0,
    newPatients: 0,
    activeTreatments: 0,
    revenueMonth: 0,
    revenueGrowth: 0,
    outstandingBalance: 0,
  },
  topServices = [],
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">📊 Clinic Dashboard</h1>
      <p className="text-sm text-gray-500">
        Key insights about patients, revenue, and treatments.
      </p>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <div className="stat bg-base-200 rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-title">Total Patients</p>
              <p className="stat-value text-primary">
                {stats.totalPatients.toLocaleString()}
              </p>
            </div>
            <FiUsers className="text-primary text-3xl" />
          </div>
          <p className="stat-desc">+{stats.newPatients} new this month</p>
        </div>

        {/* Active Treatments */}
        <div className="stat bg-base-200 rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-title">Active Treatments</p>
              <p className="stat-value text-secondary">
                {stats.activeTreatments}
              </p>
            </div>
            <FiActivity className="text-secondary text-3xl" />
          </div>
          <p className="stat-desc">Ongoing procedures</p>
        </div>

        {/* Revenue */}
        <div className="stat bg-base-200 rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-title">Revenue (Month)</p>
              <p className="stat-value text-accent">
                ₱{stats.revenueMonth.toLocaleString()}
              </p>
            </div>
            <FiDollarSign className="text-accent text-3xl" />
          </div>
          <p
            className={`stat-desc ${
              stats.revenueGrowth >= 0 ? "text-success" : "text-error"
            }`}
          >
            {stats.revenueGrowth >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(stats.revenueGrowth)}% vs last month
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="stat bg-base-200 rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-title">Outstanding Balance</p>
              <p className="stat-value text-error">
                ₱{stats.outstandingBalance.toLocaleString()}
              </p>
            </div>
            <FiTrendingUp className="text-error text-3xl" />
          </div>
          <p className="stat-desc">Pending collections</p>
        </div>
      </div>

      {/* Analytics Split */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Services */}
        <div className="bg-base-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">🦷 Top Services</h2>
          {topServices.length > 0 ? (
            <ul className="space-y-3">
              {topServices.map((service, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-3 bg-base-100 rounded-lg shadow-sm"
                >
                  <span className="font-medium">{service.name}</span>
                  <span className="text-sm text-gray-500">
                    {service.count} patients
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No data yet</p>
          )}
        </div>

        {/* Revenue Overview */}
        <div className="bg-base-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">📈 Revenue Overview</h2>
          <div className="h-40 flex items-center justify-center bg-base-100 rounded-lg shadow-inner">
            {/* Replace with a chart later */}
            <p className="text-gray-400">[Chart Placeholder]</p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Track monthly revenue and compare against previous months.
          </p>
        </div>
      </div>
    </div>
  );
}
