import { ThemeToggle } from "@/shared/components/theme-toggle";

import type { Theme } from "../../theme/use-theme";

type RepCounterHeaderProps = {
  onThemeChange: (theme: Theme) => void;
  theme: Theme;
};

export function RepCounterHeader({
  onThemeChange,
  theme,
}: RepCounterHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div className="grid gap-2">
        <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
          Physitrack MoCap
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Rep Counter</h1>
        <p className="max-w-xl text-muted-foreground">
          Count squat repetitions locally from a fixture session.
        </p>
      </div>
      <ThemeToggle onThemeChange={onThemeChange} theme={theme} />
    </header>
  );
}
