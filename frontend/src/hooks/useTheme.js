import { useState } from "react";

function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem("theme", dark ? "dark" : "light");
}

// persist theme to localStorage
export default function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(dark);
    return dark;
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      applyTheme(!prev);
      return !prev;
    });
  };

  return { isDark, toggleTheme };
}