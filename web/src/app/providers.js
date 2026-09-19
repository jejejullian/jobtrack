"use client";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toast";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
