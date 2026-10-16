import {
  sessionResultSchema,
  type SessionResult,
} from "@rep-counter/contracts";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type PatientId = "alice" | "bob";

export type Patient = {
  id: PatientId;
  label: string;
  token: string;
};

export const patients: readonly Patient[] = [
  { id: "alice", label: "Alice", token: "alice-demo-token" },
  { id: "bob", label: "Bob", token: "bob-demo-token" },
];

function patientForId(patientId: PatientId): Patient {
  const patient = patients.find(({ id }) => id === patientId);

  if (!patient) {
    throw new Error("Unknown patient");
  }

  return patient;
}

async function request(
  patientId: PatientId,
  path: string,
  options?: RequestInit,
): Promise<Response> {
  return fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${patientForId(patientId).token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}

export async function saveSessionResult(
  patientId: PatientId,
  result: SessionResult,
): Promise<SessionResult> {
  const response = await request(patientId, "/sessions", {
    body: JSON.stringify(result),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to save session result");
  }

  return sessionResultSchema.parse(await response.json());
}

export async function loadSessionResults(
  patientId: PatientId,
): Promise<SessionResult[]> {
  const response = await request(patientId, "/sessions");

  if (!response.ok) {
    throw new Error("Unable to load session history");
  }

  return sessionResultSchema.array().parse(await response.json());
}
