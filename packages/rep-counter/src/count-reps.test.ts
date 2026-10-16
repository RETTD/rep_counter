import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import { countReps } from "./count-reps.js";

type Fixture = {
  angles: number[];
  expectedReps: number;
};

function isFixture(value: unknown): value is Fixture {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("angles" in value) || !("expectedReps" in value)) {
    return false;
  }

  const { angles, expectedReps } = value;

  return (
    Array.isArray(angles) &&
    angles.every(
      (angle) => typeof angle === "number" && Number.isFinite(angle),
    ) &&
    typeof expectedReps === "number" &&
    Number.isInteger(expectedReps) &&
    expectedReps >= 0
  );
}

function readFixture(name: string): Fixture {
  const path = new URL(`../../../fixtures/${name}`, import.meta.url);
  const fixture: unknown = JSON.parse(readFileSync(path, "utf8"));

  if (!isFixture(fixture)) {
    throw new Error(`Invalid fixture: ${name}`);
  }

  return fixture;
}

describe("countReps", () => {
  it("counts a repetition after a deep squat returns to standing", () => {
    expect(countReps([172, 99, 96, 161])).toBe(1);
  });

  it("does not count a shallow attempt", () => {
    expect(countReps([172, 100, 120, 161])).toBe(0);
  });

  it("does not count an incomplete squat", () => {
    expect(countReps([172, 99, 150, 160])).toBe(0);
  });

  it("counts the clean fixture", () => {
    const fixture = readFixture("session-clean.json");

    expect(countReps(fixture.angles)).toBe(fixture.expectedReps);
  });

  it("counts the noisy fixture", () => {
    const fixture = readFixture("session-noisy.json");

    expect(countReps(fixture.angles)).toBe(fixture.expectedReps);
  });

  it("does not count shallow attempts in the shallow fixture", () => {
    const fixture = readFixture("session-shallow.json");

    expect(countReps(fixture.angles)).toBe(fixture.expectedReps);
  });

  it("counts each completed squat once", () => {
    expect(countReps([172, 99, 161, 170, 98, 162, 170])).toBe(2);
  });
});
