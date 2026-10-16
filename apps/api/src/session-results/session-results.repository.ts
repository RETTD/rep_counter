import { Inject, Injectable } from "@nestjs/common";
import { asc, desc, eq } from "drizzle-orm";

import type { SessionResult } from "@rep-counter/contracts";

import type { SessionDatabase } from "../database/database.js";
import { sessionResults } from "../database/schema.js";

export const SESSION_DATABASE = Symbol("SESSION_DATABASE");

@Injectable()
export class SessionResultsRepository {
  constructor(
    @Inject(SESSION_DATABASE) private readonly sessionDatabase: SessionDatabase,
  ) {}

  create(patientId: string, result: SessionResult): SessionResult {
    this.sessionDatabase.database
      .insert(sessionResults)
      .values({ patientId, ...result })
      .run();
    this.sessionDatabase.persist();

    return result;
  }

  listForPatient(patientId: string): SessionResult[] {
    return this.sessionDatabase.database
      .select({
        sessionId: sessionResults.sessionId,
        reps: sessionResults.reps,
        durationSec: sessionResults.durationSec,
        performedAt: sessionResults.performedAt,
      })
      .from(sessionResults)
      .where(eq(sessionResults.patientId, patientId))
      .orderBy(desc(sessionResults.performedAt), asc(sessionResults.id))
      .all();
  }
}
