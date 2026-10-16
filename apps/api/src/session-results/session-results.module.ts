import { DynamicModule, Module } from "@nestjs/common";

import { AuthenticationGuard } from "../authentication/authentication.guard.js";
import { AuthenticationService } from "../authentication/authentication.service.js";
import type { SessionDatabase } from "../database/database.js";
import { SessionResultsController } from "./session-results.controller.js";
import {
  SESSION_DATABASE,
  SessionResultsRepository,
} from "./session-results.repository.js";
import { SessionResultsService } from "./session-results.service.js";

@Module({})
export class SessionResultsModule {
  static register(database: SessionDatabase): DynamicModule {
    return {
      module: SessionResultsModule,
      controllers: [SessionResultsController],
      providers: [
        { provide: SESSION_DATABASE, useValue: database },
        AuthenticationService,
        AuthenticationGuard,
        SessionResultsRepository,
        SessionResultsService,
      ],
      exports: [SessionResultsService],
    };
  }
}
