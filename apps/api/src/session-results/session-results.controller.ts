import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
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
    @Res({ passthrough: true }) response: Response,
  ): SessionResult {
    const storedResult = this.sessionResultsService.create(
      this.patientId(authorization),
      this.parseResult(body),
    );

    response.status(storedResult.created ? 201 : 200);

    return storedResult.result;
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
