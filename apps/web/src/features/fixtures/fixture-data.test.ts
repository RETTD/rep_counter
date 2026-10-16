import { describe, expect, it } from "vitest";

import { angleChartPoints, summarizeFixture } from "./fixture-data.js";

describe("fixture data", () => {
  it("summarizes the angle range, sample count, and duration", () => {
    const summary = summarizeFixture({
      angles: [120, 90, 170],
      description: "A fixture",
      expectedReps: 1,
      sampleRateHz: 2,
    });

    expect(summary).toEqual({
      angleRange: { maximum: 170, minimum: 90 },
      durationSec: 1.5,
      sampleCount: 3,
    });
  });

  it("maps the first, highest, and last angle into chart coordinates", () => {
    expect(angleChartPoints([100, 150, 50], 200, 100)).toBe("0,50 100,0 200,100");
  });
});
