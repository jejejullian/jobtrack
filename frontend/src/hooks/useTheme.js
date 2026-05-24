import { useState } from "react";

function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem("theme", dark ? "dark" : "light");
}

export default function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    return saved === "dark";
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      applyTheme(!prev);
      return !prev;
    });
  };

  return { isDark, toggleTheme };
}
