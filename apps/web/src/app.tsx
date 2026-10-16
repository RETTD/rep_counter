import { useState } from "react";

import { countReps } from "@rep-counter/rep-counter/count-reps";
import { fixtureOptions, type FixtureName } from "@/features/fixtures/fixtures";
import { useFixture } from "@/features/fixtures/use-fixture";
import { type PatientId } from "@/features/session-results/session-results-api";
import { sessionResultForSave } from "@/features/session-results/session-result-for-save";
import { useSessionResults } from "@/features/session-results/use-session-results";
import { useTheme } from "@/features/theme/use-theme";
import { FixtureSelector } from "@/shared/components/fixture-selector";
import { FixtureDataCard } from "@/shared/components/fixture-data-card";
import { PatientSelector } from "@/shared/components/patient-selector";
import { SessionActions } from "@/shared/components/session-actions";
import { SessionHistory } from "@/shared/components/session-history";
import { SessionResultCard } from "@/shared/components/session-result-card";
import { ThemeToggle } from "@/shared/components/theme-toggle";

export function App() {
  const { setTheme, theme } = useTheme();
  const [fixtureName, setFixtureName] = useState<FixtureName>(
    fixtureOptions[0].value,
  );
  const [patientId, setPatientId] = useState<PatientId>("alice");
  const { error, fixture } = useFixture(fixtureName);
  const { history, isSaving, pendingSessionResult, save, saveError } =
    useSessionResults(patientId);

  const repetitions = fixture ? countReps(fixture.angles) : undefined;
  const durationSec = fixture
    ? fixture.angles.length / fixture.sampleRateHz
    : undefined;

  async function saveCurrentSession() {
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

    await save(result);
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
