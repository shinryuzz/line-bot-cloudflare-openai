import type { messagingApi } from "@line/bot-sdk";
import type OpenAI from "openai";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import { createLineClient } from "./line";
import { createOpenAIClient } from "./openai";
import { createDBClient } from "./db";

export interface ServiceClients {
  lineClient: messagingApi.MessagingApiClient;
  openaiClient: OpenAI;
  dbClient: DrizzleD1Database;
}

export function initializeClients(env: Env): ServiceClients {
  return {
    lineClient: createLineClient(env.LINE_CHANNEL_ACCESS_TOKEN),
    openaiClient: createOpenAIClient(env.OPENAI_API_KEY),
    dbClient: createDBClient(env.DB),
  };
}
