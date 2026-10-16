import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

function initialTheme(): Theme {
  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { setTheme, theme };
}
