"use client";

import { useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sun, Moon, User, LogOut, Menu, PanelLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth";
import { routes } from "@/config/route";
import ConfirmModal from "./ConfirmModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

// map path → page title
const pageTitles = Object.fromEntries(routes.map((r) => [r.path, r.name]));

export default function Topbar({ onMenuClick, onSidebarToggle }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const logoutModalRef = useRef(null);

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "JT";
  const pageTitle = pageTitles[pathname] ?? "Job Tracker";
  const isDark = theme === "dark";

  // handlers
  const openLogoutModal = () => {
    document.activeElement?.blur();
    logoutModalRef.current?.showModal();
  };

  const handleLogout = () => {
    toast.add({
      type: "success",
      description: "Logged out successfully.",
    });
    logout();
    router.replace("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <>
      <header className="bg-background border-b border-border h-13 flex items-center justify-between px-4 gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onSidebarToggle} aria-label="Toggle sidebar" className="hidden md:flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <PanelLeft size={22} />
          </button>

          <button onClick={onMenuClick} aria-label="Buka sidebar" className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors">
            <Menu size={20} />
          </button>

          <h1 className="truncate text-[15px] font-medium text-foreground">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle dark mode" className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {isDark ? <Moon size={22} /> : <Sun size={22} />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Profile menu" className="w-8 h-8 rounded-full bg-primary/10 border border-border hover:border-primary/40 flex items-center justify-center text-[11px] font-medium text-primary cursor-pointer">
              {initials}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 p-0 overflow-hidden rounded-xl">
              <div className="px-3.5 py-3 border-b border-border">
                <p className="text-sm font-medium truncate text-foreground">{user?.username}</p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
              </div>

              <DropdownMenuItem onClick={handleProfile} className="gap-2.5 px-3.5 py-2.5 text-sm rounded-none cursor-pointer">
                <User size={15} aria-hidden="true" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator className="m-0" />

              <DropdownMenuItem onClick={openLogoutModal} className="gap-2.5 px-3.5 py-2.5 text-sm text-destructive/80 focus:bg-destructive/10 focus:text-destructive rounded-none cursor-pointer">
                <LogOut size={15} aria-hidden="true" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ConfirmModal
        ref={logoutModalRef}
        id="logout_modal"
        title="Logout from your account?"
        description="You will need to sign in again to access your job tracker."
        confirmLabel="Logout"
        confirmVariant="destructive"
        onConfirm={handleLogout}
      />
    </>
  );
}