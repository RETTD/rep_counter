import { describe, expect, it } from "vitest";

import { parseFixture } from "./fixtures.js";

describe("parseFixture", () => {
  it("rejects an empty angle series", () => {
    expect(() =>
      parseFixture({
        angles: [],
        description: "A fixture",
        expectedReps: 0,
        sampleRateHz: 30,
      }),
    ).toThrow("Invalid fixture");
  });

  it("rejects a non-positive sample rate", () => {
    expect(() =>
      parseFixture({
        angles: [120],
        description: "A fixture",
        expectedReps: 0,
        sampleRateHz: 0,
      }),
    ).toThrow("Invalid fixture");
  });
});
