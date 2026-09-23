"use client"

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

// responsive sidebar + main area
export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-muted">
      {/* Overlay Mobile — cuma tampil kalau mobileOpen true, CSS md:hidden jaga-jaga di desktop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Desktop — selalu di-mount, CSS yang nentuin tampil/nggak */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Sidebar Mobile — selalu di-mount, slide in/out pakai transform */}
      <div
        className={`
          md:hidden fixed inset-y-0 left-0 z-40
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar isCollapsed={false} />
      </div>

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-w-0 min-h-0">
        <Topbar
          onMenuClick={() => setMobileOpen((prev) => !prev)}
          onSidebarToggle={() => setIsCollapsed((prev) => !prev)}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}