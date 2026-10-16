import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  sessionResultSchema,
  type SessionResult,
} from "@rep-counter/contracts";
import type { Response } from "express";
import { ZodError } from "zod";

import { AuthenticationGuard } from "../authentication/authentication.guard.js";
import { CurrentPatientId } from "../authentication/current-patient-id.decorator.js";
import { SessionResultsService } from "./session-results.service.js";

@Controller("sessions")
@UseGuards(AuthenticationGuard)
export class SessionResultsController {
  constructor(
    @Inject(SessionResultsService)
    private readonly sessionResultsService: SessionResultsService,
  ) {}

  @Post()
  create(
    @CurrentPatientId() patientId: string,
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ): SessionResult {
    const storedResult = this.sessionResultsService.create(
      patientId,
      this.parseResult(body),
    );

    response.status(storedResult.created ? 201 : 200);

    return storedResult.result;
  }

  @Get()
  list(@CurrentPatientId() patientId: string): SessionResult[] {
    return this.sessionResultsService.listForPatient(patientId);
  }

  private parseResult(body: unknown): SessionResult {
    try {
      return sessionResultSchema.parse(body);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.issues);
      }

      throw error;
    }
  }
}
