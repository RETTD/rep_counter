import { useEffect, useState } from "react";

import { countReps } from "@rep-counter/rep-counter/count-reps";
import type { SessionResult } from "@rep-counter/contracts";

import {
  fixtureOptions,
  loadFixture,
  type ExerciseFixture,
  type FixtureName,
} from "@/features/fixtures/fixtures";
import {
  loadSessionResults,
  type PatientId,
  saveSessionResult,
} from "@/features/session-results/session-results-api";
import { sessionResultForSave } from "@/features/session-results/session-result-for-save";
import { FixtureSelector } from "@/shared/components/fixture-selector";
import { FixtureDataCard } from "@/shared/components/fixture-data-card";
import { PatientSelector } from "@/shared/components/patient-selector";
import { SessionActions } from "@/shared/components/session-actions";
import { SessionHistory } from "@/shared/components/session-history";
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
  const [history, setHistory] = useState<SessionResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const [patientId, setPatientId] = useState<PatientId>("alice");
  const [pendingSessionResult, setPendingSessionResult] =
    useState<SessionResult>();

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

  useEffect(() => {
    let cancelled = false;

    setHistory([]);
    setSaveError(undefined);
    setPendingSessionResult(undefined);

    void loadSessionResults(patientId)
      .then((results) => {
        if (!cancelled) {
          setHistory(results);
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setSaveError(
            reason instanceof Error
              ? reason.message
              : "Unable to load session history",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const repetitions = fixture ? countReps(fixture.angles) : undefined;
  const durationSec = fixture
    ? fixture.angles.length / fixture.sampleRateHz
    : undefined;

  async function saveCurrentSession() {
    setIsSaving(true);
    setSaveError(undefined);

    const calculatedResult =
      pendingSessionResult ||
      repetitions === undefined ||
      durationSec === undefined
        ? undefined
        : {
            durationSec,
            performedAt: new Date().toISOString(),
            reps: repetitions,
            sessionId: crypto.randomUUID(),
          };
    const result = sessionResultForSave(pendingSessionResult, calculatedResult);

    try {
      await saveSessionResult(patientId, result);
      setPendingSessionResult(undefined);
      setHistory(await loadSessionResults(patientId));
    } catch (reason: unknown) {
      setPendingSessionResult(result);
      setSaveError(
        reason instanceof Error
          ? reason.message
          : "Unable to save session result",
      );
    } finally {
      setIsSaving(false);
    }
  }

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
        <PatientSelector onValueChange={setPatientId} value={patientId} />
        <FixtureSelector onValueChange={setFixtureName} value={fixtureName} />
        {error ? (
          <p className="rounded-md border border-destructive p-4 text-destructive">
            {error}
          </p>
        ) : null}
        {!fixture && !error ? (
          <p className="text-muted-foreground">Loading fixture…</p>
        ) : null}
        {fixture ? <FixtureDataCard fixture={fixture} /> : null}
        {fixture && repetitions !== undefined && durationSec !== undefined ? (
          <>
            <SessionResultCard
              description={fixture.description}
              durationSec={durationSec}
              repetitions={repetitions}
            />
            <SessionActions
              isSaving={isSaving}
              isRetry={pendingSessionResult !== undefined}
              onSave={saveCurrentSession}
              disabled={false}
            />
          </>
        ) : null}
        {saveError ? (
          <p className="rounded-md border border-destructive p-4 text-destructive">
            {saveError}
          </p>
        ) : null}
        <SessionHistory results={history} />
      </section>
    </main>
  );
}
