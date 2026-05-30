import { useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, User, LogOut, Menu, PanelLeft } from "lucide-react";
import { useAuth } from "../context/auth";
import useTheme from "../hooks/useTheme";
import { routes } from "../config/routes";

const pageTitles = Object.fromEntries(routes.map((r) => [r.path, r.name]));

export default function Topbar({ onMenuClick, onSidebarToggle }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "JT";
  const pageTitle = pageTitles[location.pathname] ?? "Job Tracker";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="bg-base-100 border-b border-base-200 h-13 flex items-center justify-between px-4 gap-3 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-2">
        {/* Toggle collapse — desktop & tablet */}
        <button onClick={onSidebarToggle} aria-label="Toggle sidebar" className="btn btn-ghost btn-sm btn-square hidden md:flex">
          <PanelLeft size={22} />
        </button>

        {/* Hamburger — mobile only */}
        <button onClick={onMenuClick} aria-label="Buka sidebar" className="btn btn-ghost btn-sm btn-square md:hidden">
          <Menu size={20} />
        </button>

        <h1 className="truncate text-[15px] font-medium text-base-content">{pageTitle}</h1>
      </div>

      {/* right */}
      <div className="flex items-center gap-2">
        <label className="swap swap-rotate cursor-pointer text-base-content/60 hover:text-base-content transition-colors p-2">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} aria-label="Toggle dark mode" />
          <Sun size={22} className="swap-off" aria-hidden="true" />
          <Moon size={22} className="swap-on" aria-hidden="true" />
        </label>

        {/* Avatar + dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            aria-label="Profile menu"
            className="w-8 h-8 rounded-full bg-primary/10 border border-base-200 hover:border-primary/40 flex items-center justify-center text-[11px] font-medium text-primary cursor-pointer"
          >
            {initials}
          </div>

          <ul tabIndex={0} className="dropdown-content menu bg-base-100 border border-base-200 rounded-xl z-50 w-48 p-0 mt-2 overflow-hidden">
            {/* Header — name + email */}
            <li className="px-3.5 py-3 border-b border-base-200 pointer-events-none">
              <p className="text-sm font-medium truncate text-base-content">{user?.username}</p>
              <p className="text-[11px] text-base-content/40 truncate mt-0.5">{user?.email}</p>
            </li>

            {/* Profile */}
            <li>
              <button onClick={handleProfile} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-none">
                <User size={15} aria-hidden="true" />
                Profile
              </button>
            </li>

            <div className="h-px bg-base-200 mx-0" />

            {/* Logout */}
            <li>
              <button onClick={handleLogout} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-error/80 hover:bg-error/10 rounded-none">
                <LogOut size={15} aria-hidden="true" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
