import type { WebhookEvent } from "@line/bot-sdk";
import type { MessageEvent, TextMessage } from "@line/bot-sdk";

import { generateResponse } from "../services/openai";
import type { ChatMessage } from "../services/openai";
import { sendReply } from "../services/line";
import type { ServiceClients } from "../services/clients";
import { getConversationHistory, saveMessage } from "../services/db";

type TextMessageEvent = MessageEvent & { message: TextMessage };

function isTextMessageEvent(event: WebhookEvent): event is TextMessageEvent {
  return event.type === "message" && event.message.type === "text";
}

export async function handleEvents(events: WebhookEvent[], clients: ServiceClients) {
  const textMessageEvents = events.filter(isTextMessageEvent);
  return Promise.all(textMessageEvents.map((event) => handleTextMessage(event, clients)));
}

async function handleTextMessage(event: TextMessageEvent, clients: ServiceClients) {
  const { lineClient, openaiClient, dbClient } = clients;

  const userId = event.source.userId;
  if (!userId) return;

  try {
    const hisotry = await getConversationHistory(dbClient, userId);
    const messageHistory: ChatMessage[] = hisotry.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const responseMessage = await generateResponse(
      openaiClient,
      event.message.text,
      messageHistory
    );

    if (!responseMessage) throw new Error("Failed to generate response");
    await saveMessage(dbClient, userId, event.message.text, "user");
    await saveMessage(dbClient, userId, responseMessage, "assistant");
    await sendReply(lineClient, event.replyToken, responseMessage);
  } catch (error) {
    console.error("Error handling message:", error);
    await sendReply(lineClient, event.replyToken, "エラーが発生しました。");
  }
}
