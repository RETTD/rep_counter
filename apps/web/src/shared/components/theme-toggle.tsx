import { Moon, Sun } from "lucide-react";

import { Button } from "@/shared/ui/button";

type Theme = "dark" | "light";

type ThemeToggleProps = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
};

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <Button
      className="gap-2"
      onClick={() => onThemeChange(nextTheme)}
      size="sm"
      variant="outline"
    >
      {theme === "light" ? <Moon /> : <Sun />}
      {nextTheme}
    </Button>
  );
}
