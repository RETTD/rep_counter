import { useCallback, useEffect, useState } from "react";

import type { SessionResult } from "@rep-counter/contracts";

import {
  loadSessionResults,
  type PatientId,
  saveSessionResult,
} from "./session-results-api";

export function useSessionResults(patientId: PatientId) {
  const [history, setHistory] = useState<SessionResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSessionResult, setPendingSessionResult] =
    useState<SessionResult>();
  const [saveError, setSaveError] = useState<string>();

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

  const save = useCallback(
    async (result: SessionResult) => {
      setIsSaving(true);
      setSaveError(undefined);

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
    },
    [patientId],
  );

  return { history, isSaving, pendingSessionResult, save, saveError };
}
