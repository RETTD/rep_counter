import type { ExerciseFixture } from "./fixtures";

export type FixtureSummary = {
  angleRange: {
    maximum: number;
    minimum: number;
  };
  durationSec: number;
  sampleCount: number;
};

export function summarizeFixture(fixture: ExerciseFixture): FixtureSummary {
  const minimum = Math.min(...fixture.angles);
  const maximum = Math.max(...fixture.angles);

  return {
    angleRange: { maximum, minimum },
    durationSec: fixture.angles.length / fixture.sampleRateHz,
    sampleCount: fixture.angles.length,
  };
}

export function angleChartPoints(
  angles: readonly number[],
  width: number,
  height: number,
): string {
  const minimum = Math.min(...angles);
  const maximum = Math.max(...angles);
  const range = maximum - minimum || 1;
  const finalIndex = Math.max(angles.length - 1, 1);

  return angles
    .map((angle, index) => {
      const x = (index / finalIndex) * width;
      const y = ((maximum - angle) / range) * height;

      return `${x},${y}`;
    })
    .join(" ");
}
