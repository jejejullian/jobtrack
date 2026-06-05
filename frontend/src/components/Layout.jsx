import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);

    check();
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-base-200">
      {/* Overlay Mobile */}
      {!isDesktop && mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Desktop */}
      {isDesktop && (
        <Sidebar isCollapsed={isCollapsed} />
      )}

      {/* Sidebar Mobile */}
      {!isDesktop && (
        <div
          className={`
            fixed inset-y-0 left-0 z-40
            transition-transform duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar isCollapsed={false} />
        </div>
      )}

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-w-0 min-h-0">
        <Topbar
          onMenuClick={() => setMobileOpen((prev) => !prev)}
          onSidebarToggle={() => setIsCollapsed((prev) => !prev)}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}