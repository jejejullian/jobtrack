"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getMe, login as loginApi, logout as logoutApi } from "../services/api";

// Simpan data user
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek login user dengan cookie yang ada
  useEffect(() => {
    let isMounted = true;

    getMe()
      .then((data) => {
        if (isMounted) setUser(data.user);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginApi(credentials); // BE set cookie httpOnly
    setUser(data.user);
    return data;
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      // server hapus cookie login
      await logoutApi();
    } finally {
      setUser(null);
    }
  }, []);

  // Sediakan user dan fungsi auth untuk component
  return <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>{children}</AuthContext.Provider>;
}
