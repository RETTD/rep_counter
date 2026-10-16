import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import request from "supertest";

import { createApi } from "../app.js";

const aliceToken = "Bearer alice-demo-token";
const bobToken = "Bearer bob-demo-token";

describe("session results API", () => {
  let api: Awaited<ReturnType<typeof createApi>>;

  beforeEach(async () => {
    api = await createApi(":memory:");
  });

  afterEach(async () => {
    await api.close();
  });

  it("rejects a request without a Bearer token", async () => {
    const response = await request(api.application.getHttpServer()).get(
      "/sessions",
    );

    expect(response.status).toBe(401);
  });

  it("rejects raw angle samples", async () => {
    const response = await request(api.application.getHttpServer())
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send({
        sessionId: "c0b65a5e-3c10-4f0e-b904-fa758f0dde51",
        reps: 8,
        durationSec: 27.6,
        performedAt: "2026-10-16T10:00:00.000Z",
        angles: [180, 90, 180],
      });

    expect(response.status).toBe(400);
  });

  it("creates Alice's result and returns it in performed-at order", async () => {
    const server = api.application.getHttpServer();
    const laterResult = {
      sessionId: "c0b65a5e-3c10-4f0e-b904-fa758f0dde51",
      reps: 8,
      durationSec: 27.6,
      performedAt: "2026-10-16T10:00:00.000Z",
    };
    const earlierResult = {
      sessionId: "d9c65914-cf52-4dc7-9a1b-8bcc1aaea0a5",
      reps: 10,
      durationSec: 36.3,
      performedAt: "2026-10-15T10:00:00.000Z",
    };

    const created = await request(server)
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send(laterResult);
    await request(server)
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send(earlierResult);
    const listed = await request(server)
      .get("/sessions")
      .set("Authorization", aliceToken);

    expect(created.status).toBe(201);
    expect(created.body).toEqual(laterResult);
    expect(listed.status).toBe(200);
    expect(listed.body).toEqual([laterResult, earlierResult]);
  });

  it("keeps Alice and Bob's histories isolated", async () => {
    const server = api.application.getHttpServer();
    const result = {
      sessionId: "c0b65a5e-3c10-4f0e-b904-fa758f0dde51",
      reps: 8,
      durationSec: 27.6,
      performedAt: "2026-10-16T10:00:00.000Z",
    };

    await request(server)
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send(result);
    await request(server)
      .post("/sessions")
      .set("Authorization", bobToken)
      .send({ ...result, reps: 10 });
    const aliceHistory = await request(server)
      .get("/sessions")
      .set("Authorization", aliceToken);
    const bobHistory = await request(server)
      .get("/sessions")
      .set("Authorization", bobToken);

    expect(aliceHistory.body).toEqual([result]);
    expect(bobHistory.body).toEqual([{ ...result, reps: 10 }]);
  });

  it("returns a stored result for an identical retry", async () => {
    const server = api.application.getHttpServer();
    const result = {
      sessionId: "c0b65a5e-3c10-4f0e-b904-fa758f0dde51",
      reps: 8,
      durationSec: 27.6,
      performedAt: "2026-10-16T10:00:00.000Z",
    };

    const created = await request(server)
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send(result);
    const retried = await request(server)
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send(result);
    const history = await request(server)
      .get("/sessions")
      .set("Authorization", aliceToken);

    expect(created.status).toBe(201);
    expect(retried.status).toBe(200);
    expect(retried.body).toEqual(result);
    expect(history.body).toEqual([result]);
  });

  it("rejects a different payload for an existing session ID", async () => {
    const server = api.application.getHttpServer();
    const result = {
      sessionId: "c0b65a5e-3c10-4f0e-b904-fa758f0dde51",
      reps: 8,
      durationSec: 27.6,
      performedAt: "2026-10-16T10:00:00.000Z",
    };

    await request(server)
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send(result);
    const conflict = await request(server)
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send({ ...result, reps: 9 });

    expect(conflict.status).toBe(409);
  });

  it("keeps an identical concurrent retry idempotent", async () => {
    const server = api.application.getHttpServer();
    const result = {
      sessionId: "c0b65a5e-3c10-4f0e-b904-fa758f0dde51",
      reps: 8,
      durationSec: 27.6,
      performedAt: "2026-10-16T10:00:00.000Z",
    };

    const responses = await Promise.all(
      [1, 2].map(() =>
        request(server)
          .post("/sessions")
          .set("Authorization", aliceToken)
          .send(result),
      ),
    );

    expect(responses.map(({ status }) => status).sort()).toEqual([200, 201]);
  });

  it("orders different timestamp offsets by the performed instant", async () => {
    const server = api.application.getHttpServer();
    const earlier = {
      sessionId: "c0b65a5e-3c10-4f0e-b904-fa758f0dde51",
      reps: 8,
      durationSec: 27.6,
      performedAt: "2026-10-16T10:00:00+02:00",
    };
    const later = {
      sessionId: "d9c65914-cf52-4dc7-9a1b-8bcc1aaea0a5",
      reps: 10,
      durationSec: 36.3,
      performedAt: "2026-10-16T09:00:00Z",
    };

    await request(server)
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send(earlier);
    await request(server)
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send(later);
    const listed = await request(server)
      .get("/sessions")
      .set("Authorization", aliceToken);

    expect(
      listed.body.map((result: { sessionId: string }) => result.sessionId),
    ).toEqual([later.sessionId, earlier.sessionId]);
  });

  it("keeps a saved result after the API reopens its database file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "rep-counter-"));
    const databasePath = join(directory, "sessions.sqlite");
    const result = {
      sessionId: "c0b65a5e-3c10-4f0e-b904-fa758f0dde51",
      reps: 8,
      durationSec: 27.6,
      performedAt: "2026-10-16T10:00:00.000Z",
    };
    const firstApi = await createApi(databasePath);

    await request(firstApi.application.getHttpServer())
      .post("/sessions")
      .set("Authorization", aliceToken)
      .send(result);
    await firstApi.close();

    const reopenedApi = await createApi(databasePath);
    const listed = await request(reopenedApi.application.getHttpServer())
      .get("/sessions")
      .set("Authorization", aliceToken);

    await reopenedApi.close();
    await rm(directory, { force: true, recursive: true });

    expect(listed.body).toEqual([result]);
  });
});
