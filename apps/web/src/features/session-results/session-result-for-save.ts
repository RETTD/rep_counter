import type { SessionResult } from "@rep-counter/contracts";

export function sessionResultForSave(
  pendingResult: SessionResult | undefined,
  calculatedResult: SessionResult | undefined,
): SessionResult {
  if (pendingResult) {
    return pendingResult;
  }

  if (!calculatedResult) {
    throw new Error("A calculated session result is required");
  }

  return calculatedResult;
}
