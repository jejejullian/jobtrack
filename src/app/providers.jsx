"use client";

import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        {children}
      </ThemeProvider>
      <Toaster />
    </AuthProvider>
  );
}
