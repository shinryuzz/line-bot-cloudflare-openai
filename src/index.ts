import { messagingApi } from "@line/bot-sdk";
import type { WebhookEvent, MessageEvent, TextMessage } from "@line/bot-sdk";

import OpenAI from "openai";

interface Env {
  LINE_CHANNEL_ACCESS_TOKEN: string;
  OPENAI_API_KEY: string;
}

interface WebhookRequestBody {
  events: WebhookEvent[];
}

async function handleMessage(event: MessageEvent & { message: TextMessage }, client: messagingApi.MessagingApiClient, openai: OpenAI) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "あなたは親切なアシスタントです。簡潔に応答してください。",
        },
        { role: "user", content: event.message.text },
      ],
    });

    const responseMeessage = completion.choices[0].message.content;
    const errorMessage = "申し訳ありません。回答を生成できませんでした。";
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: responseMeessage || errorMessage,
        },
      ],
    });
  } catch (error) {
    console.error("Error handling message:", error);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: "エラーが発生しました。",
        },
      ],
    });
  }
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const client = new messagingApi.MessagingApiClient({ channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN });
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    const { events } = (await request.json()) as WebhookRequestBody;

    ctx.waitUntil(
      Promise.all(
        events
          .filter((e): e is MessageEvent & { message: TextMessage } => e.type === "message" && e.message.type === "text")
          .map((e) => handleMessage(e, client, openai))
      )
    );

    return new Response("OK");
  },
} satisfies ExportedHandler<Env>;
