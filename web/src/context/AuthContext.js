"use client";

import { createContext, useContext } from "react";

// Context untuk menyimpan data auth
const AuthContext = createContext(null);

// Hook untuk mengambil data auth
export function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext };