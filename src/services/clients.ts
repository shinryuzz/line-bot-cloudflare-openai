import type { messagingApi } from "@line/bot-sdk";
import type OpenAI from "openai";

import { createLineClient } from "./line";
import { createOpenAIClient } from "./openai";

export interface ServiceClients {
  lineClient: messagingApi.MessagingApiClient;
  openaiClient: OpenAI;
}

export function initializeClients(env: Env): ServiceClients {
  return {
    lineClient: createLineClient(env.LINE_CHANNEL_ACCESS_TOKEN),
    openaiClient: createOpenAIClient(env.OPENAI_API_KEY),
  };
}
