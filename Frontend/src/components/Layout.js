import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <div className="flex h-screen bg-[#F9FAFB]"> {/* Modern off-white background */}
      
      {/* 1. Sidebar: Fixed width, height of screen */}
      <SideMenu />

      {/* 2. Right Side: Everything else */}
      <div className="flex flex-1 flex-col lg:ml-64 transition-all duration-300">
        
        {/* Header: Stays at the top */}
        <Header />

        {/* Main Content Area: Scrolls independently */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default Layout;