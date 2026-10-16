import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

import { AuthenticationService } from "./authentication.service.js";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization =
      typeof request.headers.authorization === "string"
        ? request.headers.authorization
        : undefined;

    if (!this.authenticationService.patientIdFromAuthorization(authorization)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
