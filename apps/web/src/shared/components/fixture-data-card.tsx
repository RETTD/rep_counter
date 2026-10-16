import type { ExerciseFixture } from "@/features/fixtures/fixtures";
import {
  angleChartPoints,
  summarizeFixture,
} from "@/features/fixtures/fixture-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type FixtureDataCardProps = {
  fixture: ExerciseFixture;
};

function formatDuration(durationSec: number): string {
  const totalSeconds = Math.round(durationSec);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function FixtureDataCard({ fixture }: FixtureDataCardProps) {
  const summary = summarizeFixture(fixture);
  const chartPoints = angleChartPoints(fixture.angles, 720, 180);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Browser-only fixture input</CardDescription>
        <CardTitle>Fixture session data</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div className="grid gap-1">
            <dt className="text-muted-foreground">Samples</dt>
            <dd className="font-medium">{summary.sampleCount}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-muted-foreground">Sample rate</dt>
            <dd className="font-medium">{fixture.sampleRateHz} Hz</dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-muted-foreground">Duration</dt>
            <dd className="font-medium">
              {formatDuration(summary.durationSec)}
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-muted-foreground">Angle range</dt>
            <dd className="font-medium">
              {summary.angleRange.minimum.toFixed(1)}°–
              {summary.angleRange.maximum.toFixed(1)}°
            </dd>
          </div>
        </dl>

        <div className="grid gap-2">
          <p className="text-sm font-medium">Knee angle over time</p>
          <svg
            className="h-44 w-full rounded-md border bg-muted/30"
            preserveAspectRatio="none"
            viewBox="0 0 720 180"
          >
            <polyline
              fill="none"
              points={chartPoints}
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{summary.angleRange.maximum.toFixed(1)}°</span>
            <span>{summary.angleRange.minimum.toFixed(1)}°</span>
          </div>
        </div>

        <details className="rounded-md border p-4">
          <summary className="cursor-pointer font-medium">
            View all {summary.sampleCount} angle samples
          </summary>
          <ol className="mt-4 grid max-h-72 grid-cols-2 gap-x-6 gap-y-2 overflow-y-auto pr-2 font-mono text-xs sm:grid-cols-3">
            {fixture.angles.map((angle, index) => (
              <li className="flex justify-between gap-2" key={index}>
                <span className="text-muted-foreground">{index + 1}</span>
                <span>{angle.toFixed(1)}°</span>
              </li>
            ))}
          </ol>
        </details>
      </CardContent>
    </Card>
  );
}
