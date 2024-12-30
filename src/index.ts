import { messagingApi } from "@line/bot-sdk";
import type { WebhookEvent, MessageEvent, TextMessage } from "@line/bot-sdk";

interface Env {
  LINE_CHANNEL_ACCESS_TOKEN: string;
}

interface WebhookRequestBody {
  events: WebhookEvent[];
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const client = new messagingApi.MessagingApiClient({ channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN });

    const { events } = (await request.json()) as WebhookRequestBody;

    await Promise.all(
      events
        .filter((e): e is MessageEvent & { message: TextMessage } => e.type === "message" && e.message.type === "text")
        .map((e) =>
          client.replyMessage({
            replyToken: e.replyToken,
            messages: [
              {
                type: "text",
                text: e.message.text,
              },
            ],
          })
        )
    );
    return new Response("OK");
  },
} satisfies ExportedHandler<Env>;
