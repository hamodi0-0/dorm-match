import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MASTER_KEY = process.env.MESSAGE_ENCRYPTION_KEY;

/**
 * Derives a unique AES-256 key for a conversation using HKDF.
 * Same master secret + different conversation ID = completely different key.
 */
async function deriveConversationKeyBytes(
  masterSecret: string,
  conversationId: string,
): Promise<Uint8Array> {
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(masterSecret),
    "HKDF",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: encoder.encode("dormr-messages-v1"), // domain separation
      info: encoder.encode(conversationId),
    },
    keyMaterial,
    256, // 32 bytes → AES-256
  );

  return new Uint8Array(derivedBits);
}

export async function POST(request: Request) {
  if (!MASTER_KEY) {
    console.error("MESSAGE_ENCRYPTION_KEY is not set");
    return NextResponse.json(
      { error: "Encryption not configured" },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let conversationIds: string[];
  try {
    const body = (await request.json()) as { conversationIds: unknown };
    if (
      !Array.isArray(body.conversationIds) ||
      body.conversationIds.length === 0
    ) {
      throw new Error("Invalid");
    }
    conversationIds = body.conversationIds as string[];
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  // One DB query validates all conversations — user must be a participant
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, student_id, lister_id")
    .in("id", conversationIds);

  const authorized = (conversations ?? []).filter(
    (c) => c.student_id === user.id || c.lister_id === user.id,
  );

  // Derive a key per authorized conversation in parallel
  const keys: Record<string, string> = {};
  await Promise.all(
    authorized.map(async (conv) => {
      const keyBytes = await deriveConversationKeyBytes(MASTER_KEY!, conv.id);
      keys[conv.id] = Buffer.from(keyBytes).toString("base64");
    }),
  );

  return NextResponse.json({ keys });
}
