import { useState } from "react";

import { countReps } from "@rep-counter/rep-counter/count-reps";
import { fixtureOptions, type FixtureName } from "@/features/fixtures/fixtures";
import { useFixture } from "@/features/fixtures/use-fixture";
import { type PatientId } from "@/features/session-results/session-results-api";
import { sessionResultForSave } from "@/features/session-results/session-result-for-save";
import { useSessionResults } from "@/features/session-results/use-session-results";
import { useTheme } from "@/features/theme/use-theme";
import { FixtureSession } from "@/features/rep-counter/components/fixture-session";
import { RepCounterHeader } from "@/features/rep-counter/components/rep-counter-header";
import { SessionConfiguration } from "@/features/rep-counter/components/session-configuration";
import { SessionActions } from "@/shared/components/session-actions";
import { SessionHistory } from "@/shared/components/session-history";
import { SessionResultCard } from "@/shared/components/session-result-card";

export function App() {
  const { setTheme, theme } = useTheme();
  const [fixtureName, setFixtureName] = useState<FixtureName>(
    fixtureOptions[0].value,
  );
  const [patientId, setPatientId] = useState<PatientId>("alice");
  const { error, fixture } = useFixture(fixtureName);
  const { history, isSaving, pendingSessionResult, save, saveError } =
    useSessionResults(patientId);

  const sessionSummary = fixture
    ? {
        description: fixture.description,
        durationSec: fixture.angles.length / fixture.sampleRateHz,
        repetitions: countReps(fixture.angles),
      }
    : undefined;

  async function saveCurrentSession() {
    const calculatedResult =
      pendingSessionResult || !sessionSummary
        ? undefined
        : {
            durationSec: sessionSummary.durationSec,
            performedAt: new Date().toISOString(),
            reps: sessionSummary.repetitions,
            sessionId: crypto.randomUUID(),
          };
    const result = sessionResultForSave(pendingSessionResult, calculatedResult);

    await save(result);
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-3xl content-center gap-8 px-5 py-12">
      <RepCounterHeader onThemeChange={setTheme} theme={theme} />

      <section className="grid gap-6">
        <SessionConfiguration
          fixtureName={fixtureName}
          isPatientSelectionDisabled={isSaving}
          onFixtureNameChange={setFixtureName}
          onPatientIdChange={setPatientId}
          patientId={patientId}
        />
        <FixtureSession error={error} fixture={fixture} />
        {sessionSummary ? (
          <>
            <SessionResultCard
              description={sessionSummary.description}
              durationSec={sessionSummary.durationSec}
              repetitions={sessionSummary.repetitions}
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
