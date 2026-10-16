import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { createDatabase } from "./database/database.js";
import { SessionResultsModule } from "./session-results/session-results.module.js";

import "reflect-metadata";

export async function createApi(filename: string) {
  const database = await createDatabase(filename);

  @Module({
    imports: [SessionResultsModule.register(database)],
  })
  class ApiModule {}

  const api = await NestFactory.create(ApiModule, { logger: false });
  api.enableCors();
  await api.init();

  return {
    application: api,
    async close() {
      await api.close();
      database.close();
    },
  };
}
