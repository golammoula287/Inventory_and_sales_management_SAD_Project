import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64">
        <Sidebar />
      </div>

      {/* Page Section */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
