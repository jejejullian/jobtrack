import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, User, LogOut, Menu, PanelLeft } from "lucide-react";
import { useAuth } from "../context/auth";
import useTheme from "../hooks/useTheme";
import { routes } from "../config/routes";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";

// map path → page title
const pageTitles = Object.fromEntries(routes.map((r) => [r.path, r.name]));

export default function Topbar({ onMenuClick, onSidebarToggle }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const logoutModalRef = useRef(null);

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "JT";
  const pageTitle = pageTitles[location.pathname] ?? "Job Tracker";

  // handlers
  const openLogoutModal = () => {
    document.activeElement?.blur();
    logoutModalRef.current?.showModal();
  };

  const handleLogout = () => {
    toast.success("Logged out successfully.");
    logout();
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      <header className="bg-base-100 border-b border-base-200 h-13 flex items-center justify-between px-4 gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onSidebarToggle} aria-label="Toggle sidebar" className="btn btn-ghost btn-sm btn-square hidden md:flex">
            <PanelLeft size={22} />
          </button>

          <button onClick={onMenuClick} aria-label="Buka sidebar" className="btn btn-ghost btn-sm btn-square md:hidden">
            <Menu size={20} />
          </button>

          <h1 className="truncate text-[15px] font-medium text-base-content">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="swap swap-rotate cursor-pointer text-base-content/60 hover:text-base-content transition-colors p-2">
            <input type="checkbox" checked={isDark} onChange={toggleTheme} aria-label="Toggle dark mode" />
            <Sun size={22} className="swap-off" aria-hidden="true" />
            <Moon size={22} className="swap-on" aria-hidden="true" />
          </label>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              aria-label="Profile menu"
              className="w-8 h-8 rounded-full bg-primary/10 border border-base-200 hover:border-primary/40 flex items-center justify-center text-[11px] font-medium text-primary cursor-pointer"
            >
              {initials}
            </div>

            <ul tabIndex={0} className="dropdown-content menu bg-base-100 border border-base-300 shadow rounded-xl z-50 w-48 p-0 mt-2 overflow-hidden">
              <li className="px-3.5 py-3 border-b border-base-200 pointer-events-none">
                <p className="text-sm font-medium truncate text-base-content">{user?.username}</p>
                <p className="text-[11px] text-base-content/40 truncate mt-0.5">{user?.email}</p>
              </li>

              <li>
                <button onClick={handleProfile} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-none hover:bg-base-300 active:bg-primary/10 active:text-primary">
                  <User size={15} aria-hidden="true" />
                  Profile
                </button>
              </li>

              <div className="h-px bg-base-200 mx-0" />

              <li>
                <button onClick={openLogoutModal} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-error/80 hover:bg-error/10 active:bg-error/20 rounded-none">
                  <LogOut size={15} aria-hidden="true" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <ConfirmModal ref={logoutModalRef} id="logout_modal" title="Logout from your account?" description="You will need to sign in again to access your job tracker." confirmLabel="Logout" confirmClass="btn-error" onConfirm={handleLogout} />
    </>
  );
}
