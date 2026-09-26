import { LayoutDashboard, Briefcase, User } from "lucide-react";

// sidebar & page title config
export const routes = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, end: true },
  { name: "Jobs", path: "/jobs", icon: Briefcase },
  { name: "Profile", path: "/profile", icon: User },
];