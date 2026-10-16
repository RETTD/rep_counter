import { Inject, Injectable } from "@nestjs/common";
import { asc, desc, eq } from "drizzle-orm";

import type { SessionResult } from "@rep-counter/contracts";

import type { SessionDatabase } from "../database/database.js";
import { sessionResults } from "../database/schema.js";

export const SESSION_DATABASE = Symbol("SESSION_DATABASE");

export type StoredSessionResult = {
  created: boolean;
  result: SessionResult;
};

@Injectable()
export class SessionResultsRepository {
  constructor(
    @Inject(SESSION_DATABASE) private readonly sessionDatabase: SessionDatabase,
  ) {}

  createOrFind(patientId: string, result: SessionResult): StoredSessionResult {
    const storedResult = this.findBySessionId(patientId, result.sessionId);

    if (storedResult) {
      return { created: false, result: storedResult };
    }

    this.sessionDatabase.database
      .insert(sessionResults)
      .values({ patientId, ...result })
      .run();
    this.sessionDatabase.persist();

    return { created: true, result };
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

  private findBySessionId(
    patientId: string,
    sessionId: string,
  ): SessionResult | undefined {
    return this.sessionDatabase.database
      .select({
        sessionId: sessionResults.sessionId,
        reps: sessionResults.reps,
        durationSec: sessionResults.durationSec,
        performedAt: sessionResults.performedAt,
      })
      .from(sessionResults)
      .where(eq(sessionResults.patientId, patientId))
      .all()
      .find((result) => result.sessionId === sessionId);
  }
}
