const bottomThreshold = 100;
const standingThreshold = 160;

export function countReps(angles: readonly number[]): number {
  let repetitions = 0;
  let reachedBottom = false;

  for (const angle of angles) {
    if (!reachedBottom && angle < bottomThreshold) {
      reachedBottom = true;
    }

    if (reachedBottom && angle > standingThreshold) {
      repetitions += 1;
      reachedBottom = false;
    }
  }

  return repetitions;
}
