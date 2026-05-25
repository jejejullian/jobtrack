import { NavLink } from "react-router-dom";
import { routes } from "../config/routes";

const sidebarMenu = routes.filter(r => r.path !== "/profile");

export default function Sidebar({ isCollapsed }) {
  const navClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-xl text-sm transition-colors
    ${isActive ? "bg-primary/10 text-primary font-medium" : "text-base-content/60 hover:bg-base-200"}`;

  return (
    <aside
      className={`
        bg-base-100 border-r border-base-200 h-dvh overflow-hidden transition-[width] duration-300 ease-in-out
        ${isCollapsed ? "w-18" : "w-64"}
      `}
    >
      <div className="h-full flex flex-col">
        {/* Brand */}
        <div className="border-b border-base-200">
          <div className="flex items-center px-4 py-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Job Tracker" className="h-7 md:h-8 w-auto" />
            </div>
            {!isCollapsed && <span className="ml-3 font-bold text-xl md:text-2xl whitespace-nowrap">Job Tracker</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1" aria-label="Main Navigation">
          {!isCollapsed && <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-base-content/40">Menu</p>}

          {sidebarMenu.map(({ name, path, icon: Icon, end }) => (
            <NavLink key={path} to={path} end={end} className={navClass}>
              <div className="w-5 flex justify-center shrink-0">
                <Icon size={20} />
              </div>
              {!isCollapsed && <span className="ml-3 whitespace-nowrap">{name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
