import {
  sessionResultSchema,
  type SessionResult,
} from "@rep-counter/contracts";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const authorization = "Bearer alice-demo-token";

async function request(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}

export async function saveSessionResult(
  result: SessionResult,
): Promise<SessionResult> {
  const response = await request("/sessions", {
    body: JSON.stringify(result),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to save session result");
  }

  return sessionResultSchema.parse(await response.json());
}

export async function loadSessionResults(): Promise<SessionResult[]> {
  const response = await request("/sessions");

  if (!response.ok) {
    throw new Error("Unable to load session history");
  }

  return sessionResultSchema.array().parse(await response.json());
}
