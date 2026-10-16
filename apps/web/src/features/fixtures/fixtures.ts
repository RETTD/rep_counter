export type ExerciseFixture = {
  angles: number[];
  description: string;
  expectedReps: number;
  sampleRateHz: number;
};

export const fixtureOptions = [
  { label: "Clean session", value: "session-clean.json" },
  { label: "Noisy session", value: "session-noisy.json" },
  { label: "Shallow session", value: "session-shallow.json" },
] as const;

export type FixtureName = (typeof fixtureOptions)[number]["value"];

function isExerciseFixture(value: unknown): value is ExerciseFixture {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const angles = Reflect.get(value, "angles");
  const description = Reflect.get(value, "description");
  const expectedReps = Reflect.get(value, "expectedReps");
  const sampleRateHz = Reflect.get(value, "sampleRateHz");

  return (
    Array.isArray(angles) &&
    angles.length > 0 &&
    angles.every((angle) => typeof angle === "number" && Number.isFinite(angle)) &&
    typeof description === "string" &&
    typeof expectedReps === "number" &&
    Number.isInteger(expectedReps) &&
    expectedReps >= 0 &&
    typeof sampleRateHz === "number" &&
    Number.isFinite(sampleRateHz) &&
    sampleRateHz > 0
  );
}

export function parseFixture(value: unknown): ExerciseFixture {
  if (!isExerciseFixture(value)) {
    throw new Error("Invalid fixture");
  }

  return value;
}

export async function loadFixture(name: FixtureName): Promise<ExerciseFixture> {
  const response = await fetch(`/${name}`);

  if (!response.ok) {
    throw new Error(`Unable to load ${name}`);
  }

  const fixture: unknown = await response.json();

  return parseFixture(fixture);
}
