import type { WebhookEvent } from "@line/bot-sdk";

import { handleEvents } from "./handlers/message";
import { initializeClients } from "./services/clients";

interface WebhookRequestBody {
  events: WebhookEvent[];
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { events } = (await request.json()) as WebhookRequestBody;
    const clients = initializeClients(env);

    ctx.waitUntil(handleEvents(events, clients));
    return new Response("OK");
  },
} satisfies ExportedHandler<Env>;
