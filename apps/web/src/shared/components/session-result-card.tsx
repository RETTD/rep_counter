import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type SessionResultCardProps = {
  description: string;
  durationSec: number;
  repetitions: number;
};

function formatDuration(durationSec: number): string {
  const totalSeconds = Math.round(durationSec);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SessionResultCard({
  description,
  durationSec,
  repetitions,
}: SessionResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Local result</CardDescription>
        <CardTitle className="text-5xl tracking-tight">
          {repetitions} reps
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground">
        <p>{description}</p>
        <p>
          Duration{" "}
          <span className="font-medium text-foreground">
            {formatDuration(durationSec)}
          </span>
        </p>
        <p>Angle Samples remain in this browser.</p>
      </CardContent>
    </Card>
  );
}
