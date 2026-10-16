import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import { createApi } from "../app.js";

const aliceToken = "Bearer alice-demo-token";

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
});
