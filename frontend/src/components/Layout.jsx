import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isDesktop === null) return null;

  const sidebarVisible = isDesktop || mobileOpen;

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Overlay - mobile only */}
      {!isDesktop && mobileOpen && <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setMobileOpen(false)} aria-hidden="true"/>}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 h-full transition-transform duration-200 ${sidebarVisible ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-w-0 overflow-hidden bg-primary-content transition-[margin] duration-300
          ${isDesktop ? (isCollapsed ? "ml-18" : "ml-64") : "ml-0"}`}
      >
        <Topbar onMenuClick={() => setMobileOpen((prev) => !prev)} onSidebarToggle={() => setIsCollapsed((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
