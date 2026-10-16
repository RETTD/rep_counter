import { ConflictException, Injectable } from "@nestjs/common";

import type { SessionResult } from "@rep-counter/contracts";

import {
  type StoredSessionResult,
  SessionResultsRepository,
} from "./session-results.repository.js";

@Injectable()
export class SessionResultsService {
  constructor(
    private readonly sessionResultsRepository: SessionResultsRepository,
  ) {}

  create(patientId: string, result: SessionResult): StoredSessionResult {
    const storedResult = this.sessionResultsRepository.createOrFind(
      patientId,
      result,
    );

    if (
      !storedResult.created &&
      !sameSessionResult(storedResult.result, result)
    ) {
      throw new ConflictException(
        "A different session result already exists for this session ID",
      );
    }

    return storedResult;
  }

  listForPatient(patientId: string): SessionResult[] {
    return this.sessionResultsRepository.listForPatient(patientId);
  }
}

function sameSessionResult(left: SessionResult, right: SessionResult): boolean {
  return (
    left.sessionId === right.sessionId &&
    left.reps === right.reps &&
    left.durationSec === right.durationSec &&
    left.performedAt === right.performedAt
  );
}
