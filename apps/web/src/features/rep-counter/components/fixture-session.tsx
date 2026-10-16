import type { ExerciseFixture } from "@/features/fixtures/fixtures";
import { FixtureDataCard } from "@/shared/components/fixture-data-card";

type FixtureSessionProps = {
  error: string | undefined;
  fixture: ExerciseFixture | undefined;
};

export function FixtureSession({ error, fixture }: FixtureSessionProps) {
  if (error) {
    return (
      <p className="rounded-md border border-destructive p-4 text-destructive">
        {error}
      </p>
    );
  }

  if (!fixture) {
    return <p className="text-muted-foreground">Loading fixture…</p>;
  }

  return <FixtureDataCard fixture={fixture} />;
}
