import OpenAI from "openai";

export function createOpenAIClient(apiKey: string) {
  return new OpenAI({ apiKey });
}

export async function generateResponse(openai: OpenAI, userMessage: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "system",
        content: "あなたは親切なアシスタントです。簡潔に応答してください。",
      },
      { role: "user", content: userMessage },
    ],
  });

  const responseMeessage = completion.choices[0].message.content;
  const errorMessage = "申し訳ありません。回答を生成できませんでした。";

  return responseMeessage || errorMessage;
}
