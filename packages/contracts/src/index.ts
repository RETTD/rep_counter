import { z } from "zod";

export const sessionResultSchema = z
  .object({
    sessionId: z.uuid(),
    reps: z.number().int().nonnegative(),
    durationSec: z.number().positive(),
    performedAt: z
      .string()
      .datetime({ offset: true })
      .transform((value) => new Date(value).toISOString()),
  })
  .strict();

export type SessionResult = z.infer<typeof sessionResultSchema>;
