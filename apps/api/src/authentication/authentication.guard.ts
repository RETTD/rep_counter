import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { AuthenticatedRequest } from "./authenticated-request.js";
import { AuthenticationService } from "./authentication.service.js";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization =
      typeof request.headers.authorization === "string"
        ? request.headers.authorization
        : undefined;

    const patientId =
      this.authenticationService.patientIdFromAuthorization(authorization);

    if (!patientId) {
      throw new UnauthorizedException();
    }

    request.auth = { patientId };

    return true;
  }
}
