import { useAuthStore } from "@/app/stores/authStore";
import React, { useState, useEffect } from "react";
import { FiLogOut, FiMenu, FiSettings, FiUser } from "react-icons/fi";

function TopBar() {
  const { current, logout } = useAuthStore();

  // Live DateTime
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full navbar bg-base-100 shadow-md border-b border-base-300 px-4 sticky top-0 z-30">
      {/* Mobile drawer toggle */}
      <div className="flex-none lg:hidden">
        <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
          <FiMenu size={22} />
        </label>
      </div>

      {/* Title */}
      <div className="flex-1">
        <h1 className="text-lg md:text-xl font-bold text-primary transition-colors">
          Welcome, <span className="text-base-content">{current.email}</span>
        </h1>
      </div>

      {/* Right section */}
      <div className="flex-none flex items-center gap-4">
        {/* Live Datetime with subtle animation */}
        <span className="text-xs md:text-sm text-gray-500 hidden md:block animate-pulse">
          {dateTime}
        </span>

        {/* User Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-circle avatar placeholder ring ring-primary ring-offset-2 ring-offset-base-100"
          >
            <div className="bg-primary text-primary-content rounded-full w-10 flex items-center justify-center font-semibold">
              <span>{current.email.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-xl w-56"
          >
            <li className="menu-title text-xs text-gray-500">
              {current.email}
            </li>
            <li>
              <a className="flex items-center gap-2">
                <FiUser /> Profile
              </a>
            </li>
            <li>
              <a className="flex items-center gap-2">
                <FiSettings /> Settings
              </a>
            </li>
            <li>
              <a
                onClick={logout}
                className="flex items-center gap-2 text-error font-semibold"
              >
                <FiLogOut /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
