import { Injectable } from "@nestjs/common";

const patientsByToken = new Map([["alice-demo-token", "alice"]]);

@Injectable()
export class AuthenticationService {
  patientIdFromAuthorization(
    authorization: string | undefined,
  ): string | undefined {
    const token = authorization?.match(/^Bearer (?<token>.+)$/)?.groups?.token;

    return token ? patientsByToken.get(token) : undefined;
  }
}
