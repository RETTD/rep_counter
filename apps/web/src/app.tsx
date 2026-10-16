import { useEffect, useState } from "react";

import { countReps } from "@rep-counter/rep-counter/count-reps";

import {
  fixtureOptions,
  loadFixture,
  type ExerciseFixture,
  type FixtureName,
} from "@/features/fixtures/fixtures";
import { FixtureSelector } from "@/shared/components/fixture-selector";
import { SessionResultCard } from "@/shared/components/session-result-card";
import { ThemeToggle } from "@/shared/components/theme-toggle";

type Theme = "dark" | "light";

function initialTheme(): Theme {
  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

export function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [fixtureName, setFixtureName] = useState<FixtureName>(
    fixtureOptions[0].value,
  );
  const [fixture, setFixture] = useState<ExerciseFixture>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    setFixture(undefined);
    setError(undefined);

    void loadFixture(fixtureName)
      .then((loadedFixture) => {
        if (!cancelled) {
          setFixture(loadedFixture);
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error ? reason.message : "Unable to load fixture",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fixtureName]);

  const repetitions = fixture ? countReps(fixture.angles) : undefined;
  const durationSec = fixture
    ? fixture.angles.length / fixture.sampleRateHz
    : undefined;

  return (
    <main className="mx-auto grid min-h-screen max-w-3xl content-center gap-8 px-5 py-12">
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
        <ThemeToggle onThemeChange={setTheme} theme={theme} />
      </header>

      <section className="grid gap-6">
        <FixtureSelector onValueChange={setFixtureName} value={fixtureName} />
        {error ? (
          <p className="rounded-md border border-destructive p-4 text-destructive">
            {error}
          </p>
        ) : null}
        {!fixture && !error ? (
          <p className="text-muted-foreground">Loading fixture…</p>
        ) : null}
        {fixture && repetitions !== undefined && durationSec !== undefined ? (
          <SessionResultCard
            description={fixture.description}
            durationSec={durationSec}
            repetitions={repetitions}
          />
        ) : null}
      </section>
    </main>
  );
}
