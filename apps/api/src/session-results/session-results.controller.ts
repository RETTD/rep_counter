import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  sessionResultSchema,
  type SessionResult,
} from "@rep-counter/contracts";
import { ZodError } from "zod";

import { AuthenticationGuard } from "../authentication/authentication.guard.js";
import { AuthenticationService } from "../authentication/authentication.service.js";
import { SessionResultsService } from "./session-results.service.js";

@Controller("sessions")
@UseGuards(AuthenticationGuard)
export class SessionResultsController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly sessionResultsService: SessionResultsService,
  ) {}

  @Post()
  create(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: unknown,
  ): SessionResult {
    return this.sessionResultsService.create(
      this.patientId(authorization),
      this.parseResult(body),
    );
  }

  @Get()
  list(
    @Headers("authorization") authorization: string | undefined,
  ): SessionResult[] {
    return this.sessionResultsService.listForPatient(
      this.patientId(authorization),
    );
  }

  private patientId(authorization: string | undefined): string {
    const patientId =
      this.authenticationService.patientIdFromAuthorization(authorization);

    if (!patientId) {
      throw new BadRequestException("Authenticated patient is required");
    }

    return patientId;
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
