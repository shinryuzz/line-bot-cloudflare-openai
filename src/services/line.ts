import { messagingApi } from "@line/bot-sdk";

export function createLineClient(token: string) {
  return new messagingApi.MessagingApiClient({ channelAccessToken: token });
}

export async function sendReply(client: messagingApi.MessagingApiClient, replyToken: string, text: string) {
  await client.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text,
      },
    ],
  });
}
