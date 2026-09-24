"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/config/route";
import InstallGuide from "./InstallGuide";
import Image from "next/image";

// exclude profile from sidebar
const sidebarMenu = routes.filter((r) => r.path !== "/profile");

// collapsible sidebar
export default function Sidebar({ isCollapsed }) {
  const pathname = usePathname();

  const navClass = (isActive) =>
    `flex items-center px-4 py-3 rounded-xl text-sm transition-colors
    ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`;

  return (
    <aside
      className={`bg-background border-r border-border h-dvh overflow-hidden transition-[width] duration-300 ease-in-out
        ${isCollapsed ? "w-18" : "w-64"}`}
    >
      <div className="h-full flex flex-col">
        {/* Brand */}
        <div className="border-b border-border">
          <div className="flex items-center px-4 py-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <Image src="/logo.png" width={1254} height={1254} alt="Job Tracker" className="h-7 md:h-8 w-auto" />
            </div>
            {!isCollapsed && <span className="ml-3 font-bold text-xl md:text-2xl whitespace-nowrap">Job Tracker</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1" aria-label="Main Navigation">
          {!isCollapsed && <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">Menu</p>}

          {sidebarMenu.map(({ name, path, icon: Icon, end }) => {
            const isActive = end ? pathname === path : pathname.startsWith(path);

            return (
              <Link key={path} href={path} className={navClass(isActive)}>
                <div className="w-5 flex justify-center shrink-0">
                  <Icon size={20} />
                </div>
                {!isCollapsed && <span className="ml-3 whitespace-nowrap">{name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Install Guide */}
        {!isCollapsed && <InstallGuide />}
      </div>
    </aside>
  );
}
