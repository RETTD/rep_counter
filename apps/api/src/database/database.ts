import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/sql-js";
import initSqlJs from "sql.js";

export async function createDatabase(filename: string) {
  const SQL = await initSqlJs();
  const client = new SQL.Database(
    filename === ":memory:" || !existsSync(filename)
      ? undefined
      : readFileSync(filename),
  );
  const database = drizzle(client);

  database.run(sql`
    CREATE TABLE IF NOT EXISTS session_results (
      id INTEGER PRIMARY KEY,
      patient_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      reps INTEGER NOT NULL,
      duration_sec REAL NOT NULL,
      performed_at TEXT NOT NULL,
      UNIQUE(patient_id, session_id)
    )
  `);

  function persist() {
    if (filename === ":memory:") {
      return;
    }

    mkdirSync(dirname(filename), { recursive: true });
    writeFileSync(filename, client.export());
  }

  return {
    database,
    close() {
      persist();
      client.close();
    },
    persist,
  };
}

export type SessionDatabase = Awaited<ReturnType<typeof createDatabase>>;
