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
    angles.every((angle) => typeof angle === "number") &&
    typeof description === "string" &&
    typeof expectedReps === "number" &&
    typeof sampleRateHz === "number"
  );
}

export async function loadFixture(name: FixtureName): Promise<ExerciseFixture> {
  const response = await fetch(`/${name}`);

  if (!response.ok) {
    throw new Error(`Unable to load ${name}`);
  }

  const fixture: unknown = await response.json();

  if (!isExerciseFixture(fixture)) {
    throw new Error(`Invalid fixture: ${name}`);
  }

  return fixture;
}
