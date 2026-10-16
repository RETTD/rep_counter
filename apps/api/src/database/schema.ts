import {
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const sessionResults = sqliteTable(
  "session_results",
  {
    id: integer().primaryKey(),
    patientId: text("patient_id").notNull(),
    sessionId: text("session_id").notNull(),
    reps: integer().notNull(),
    durationSec: real("duration_sec").notNull(),
    performedAt: text("performed_at").notNull(),
  },
  (table) => [
    uniqueIndex("session_results_patient_session").on(
      table.patientId,
      table.sessionId,
    ),
  ],
);
