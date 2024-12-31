import OpenAI from "openai";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export function createOpenAIClient(apiKey: string) {
  return new OpenAI({ apiKey });
}

export async function generateResponse(openai: OpenAI, content: string, history: ChatMessage[]) {
  const model = "gpt-4o-mini-2024-07-18";
  const systemSetting = `
あなたは親切なアシスタントです。
以下の制約に従って回答してください：
- マークダウン記法を使用しない
- コードブロックやインラインコードの記法を使用しない
- 箇条書きには記号や番号ではなく、「・」を使用する
- 簡潔に応答する
`;

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: systemSetting,
    },
    ...history,
    {
      role: "user",
      content,
    },
  ];

  const completion = await openai.chat.completions.create({
    model,
    messages,
  });

  const responseMeessage = completion.choices[0].message.content;
  const errorMessage = "申し訳ありません。回答を生成できませんでした。";

  return responseMeessage || errorMessage;
}
