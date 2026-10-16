import { Injectable } from "@nestjs/common";

import type { SessionResult } from "@rep-counter/contracts";

import { SessionResultsRepository } from "./session-results.repository.js";

@Injectable()
export class SessionResultsService {
  constructor(
    private readonly sessionResultsRepository: SessionResultsRepository,
  ) {}

  create(patientId: string, result: SessionResult): SessionResult {
    return this.sessionResultsRepository.create(patientId, result);
  }

  listForPatient(patientId: string): SessionResult[] {
    return this.sessionResultsRepository.listForPatient(patientId);
  }
}
