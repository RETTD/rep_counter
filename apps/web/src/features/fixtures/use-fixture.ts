import { useEffect, useState } from "react";

import {
  loadFixture,
  type ExerciseFixture,
  type FixtureName,
} from "./fixtures";

export function useFixture(fixtureName: FixtureName) {
  const [fixture, setFixture] = useState<ExerciseFixture>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    setFixture(undefined);
    setError(undefined);

    void loadFixture(fixtureName)
      .then((loadedFixture) => {
        if (!cancelled) {
          setFixture(loadedFixture);
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error ? reason.message : "Unable to load fixture",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fixtureName]);

  return { error, fixture };
}
