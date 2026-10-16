import { describe, expect, it } from "vitest";

import { sessionResultForSave } from "./session-result-for-save.js";

describe("sessionResultForSave", () => {
  it("returns the pending payload unchanged for a retry", () => {
    const pendingResult = {
      durationSec: 27.6,
      performedAt: "2026-10-16T10:00:00.000Z",
      reps: 8,
      sessionId: "c0b65a5e-3c10-4f0e-b904-fa758f0dde51",
    };

    expect(
      sessionResultForSave(pendingResult, {
        durationSec: 36.3,
        performedAt: "2026-10-17T10:00:00.000Z",
        reps: 10,
        sessionId: "d9c65914-cf52-4dc7-9a1b-8bcc1aaea0a5",
      }),
    ).toEqual(pendingResult);
  });
});
