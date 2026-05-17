"use client";

// ─── Key cache ────────────────────────────────────────────────────────────────
// Keys are derived server-side (master secret never touches the browser).
// Cached in memory for the session — one API call per conversation per reload.

const keyCache = new Map<string, CryptoKey>();

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importAesKey(rawBytes: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    rawBytes as unknown as BufferSource, // <-- Add type assertion here
    { name: "AES-GCM", length: 256 },
    false, // not extractable — can't be read back out of memory
    ["encrypt", "decrypt"],
  );
}
// ─── Batch key loading ────────────────────────────────────────────────────────

async function fetchRawKeys(
  conversationIds: string[],
): Promise<Record<string, string>> {
  const response = await fetch("/api/chat/keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationIds }),
  });
  if (!response.ok) throw new Error("Failed to fetch encryption keys");
  const { keys } = (await response.json()) as { keys: Record<string, string> };
  return keys;
}

/**
 * Preloads keys for multiple conversations in a single API round trip.
 * Call this when loading the conversation list so all keys are hot in cache
 * before any encrypt/decrypt operation needs them.
 */
export async function preloadConversationKeys(
  conversationIds: string[],
): Promise<void> {
  const uncached = conversationIds.filter((id) => !keyCache.has(id));
  if (uncached.length === 0) return;

  const rawKeys = await fetchRawKeys(uncached);
  await Promise.all(
    Object.entries(rawKeys).map(async ([id, b64]) => {
      const key = await importAesKey(base64ToUint8Array(b64));
      keyCache.set(id, key);
    }),
  );
}

/**
 * Returns the AES-256-GCM key for a conversation.
 * Hits the in-memory cache if available; otherwise makes a single API call.
 */
export async function getConversationKey(
  conversationId: string,
): Promise<CryptoKey> {
  const cached = keyCache.get(conversationId);
  if (cached) return cached;

  const rawKeys = await fetchRawKeys([conversationId]);
  const b64 = rawKeys[conversationId];
  if (!b64) throw new Error("Encryption key unavailable for this conversation");

  const key = await importAesKey(base64ToUint8Array(b64));
  keyCache.set(conversationId, key);
  return key;
}

// ─── Encrypt / Decrypt ────────────────────────────────────────────────────────

/**
 * Encrypts plaintext with AES-256-GCM.
 * Stored format: base64( 12-byte IV || ciphertext )
 */
export async function encryptMessage(
  plaintext: string,
  key: CryptoKey,
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  // Prepend IV to ciphertext so we have everything needed to decrypt
  const combined = new Uint8Array(12 + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), 12);
  return uint8ArrayToBase64(combined);
}

/**
 * Decrypts a message encrypted with encryptMessage.
 * Falls back to returning the raw value if decryption fails — this handles
 * legacy plaintext messages stored before encryption was enabled.
 */
export async function tryDecryptMessage(
  value: string,
  key: CryptoKey,
): Promise<string> {
  try {
    const combined = base64ToUint8Array(value);
    if (combined.length <= 12) return value; // too short to be valid ciphertext

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );
    return new TextDecoder().decode(plaintext);
  } catch {
    return value; // not encrypted or corrupted — display as-is
  }
}
