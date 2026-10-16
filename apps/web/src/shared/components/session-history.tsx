import type { SessionResult } from "@rep-counter/contracts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type SessionHistoryProps = {
  results: SessionResult[];
};

function formatDuration(durationSec: number): string {
  const minutes = Math.floor(durationSec / 60);
  const seconds = Math.round(durationSec % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SessionHistory({ results }: SessionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved sessions</CardTitle>
        <CardDescription>
          Your most recently performed sessions appear first.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="text-muted-foreground">No sessions saved yet.</p>
        ) : (
          <ul className="grid gap-3">
            {results.map((result) => (
              <li
                className="flex items-center justify-between gap-4"
                key={result.sessionId}
              >
                <span>{new Date(result.performedAt).toLocaleString()}</span>
                <span className="text-muted-foreground">
                  {result.reps} reps · {formatDuration(result.durationSec)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
