import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import { conversations } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";

export function createDBClient(db: D1Database) {
  return drizzle(db);
}

export async function saveMessage(
  db: DrizzleD1Database,
  userId: string,
  content: string,
  role: "user" | "assistant"
) {
  return await db.insert(conversations).values({
    id: crypto.randomUUID(),
    userId,
    content,
    role,
  });
}

export async function getConversationHistory(db: DrizzleD1Database, userId: string) {
  const limit = 10;

  const messages = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.createdAt))
    .limit(limit);

  return messages.reverse();
}
