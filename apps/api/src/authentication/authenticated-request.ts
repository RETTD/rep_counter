import type { Request } from "express";

export type AuthenticatedPrincipal = Readonly<{
  patientId: string;
}>;

export type AuthenticatedRequest = Request & {
  auth?: AuthenticatedPrincipal;
};
