# Real-Time Chat Implementation Guide (Supabase + React Query)

This guide documents the architecture, implementation steps, and critical pitfalls of building a real-time bilateral chat system using Next.js, Supabase, and React Query. This is meant to serve as a reference and an interview preparation guide.

## Overview of the Architecture

The chat system relies on three main pillars:

1. **PostgreSQL / Supabase**: The source of truth. Stores `messages` and `conversations`.
2. **Supabase Realtime (WebSockets)**: Broadcasts database changes (`INSERT`, `UPDATE`) to connected clients instantly.
3. **React Query**: Manages client-side server state, caching, and UI reactivity.

---

## Step 1: Enabling Database Realtime (The First Pitfall)

**How it works:**
By default, Supabase does not broadcast table changes over WebSockets because it's expensive. You must explicitly opt-in tables to a specific Postgres publication called `supabase_realtime`.

**The Pitfall:**
If you write front-end code to subscribe to a channel (`supabase.channel('...').on('postgres_changes', ...)`), it will connect successfully, but you will **never receive events** if the table isn't in the publication.

**The Fix:**
You must run the following SQL command or toggle it in the Supabase Dashboard (Database -> Publications):

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
```

---

## Step 2: Caching Strategy (`staleTime`)

**How it works:**
React Query caches HTTP requests based on query keys (e.g., `["messages", conversationId]`). `staleTime` determines how long data is considered "fresh" before React Query decides it needs to fetch again behind the scenes.

**The Pitfall:**
We initially had `staleTime: 1000 * 60 * 5` (5 minutes). If a user opened Chat A, left, and came back 2 minutes later, React Query would serve the cached messages and _not_ refetch. If the other user sent a message during those 2 minutes, it wouldn't show up.

**The Fix:**
Set `staleTime: 0` for real-time volatile data like messages. Whenever the user navigates into a chat, React Query instantly serves the cache for immediate UI, but immediately fires a background refetch to ensure it has the latest messages.

---

## Step 3: Optimistic Updates (Sending Messages)

**How it works:**
Users hate waiting for network latency. When a user hits "Send", we should instantly render the message on their screen before the database even confirms it.

**Implementation Details:**

1. Generate a temporary ID (`temp-${Date.now()}`).
2. Create a dummy message object.
3. Use `queryClient.setQueryData` to push it to the UI array instantly.
4. Execute the actual `supabase.from('messages').insert(...)`.
5. **Success**: Swap the dummy message with the real message returned from the database (which includes the real Postgres UUID and timestamp).
6. **Failure**: Revert the cache to the previous state and put the text back into the input field so the user doesn't lose it.

---

## Step 4: Subscribing to Remote Messages

To receive messages from the _other_ user, we establish WebSocket listeners doing two things:

1. **Global Sidebar Listener**: Listens to all `messages` inserts. When one fires, it updates the unread badge counts globally.
2. **Active Chat Window Listener**: Listens to `messages` inserts specific to `conversation_id=eq.${id}`.

---

## Step 5: The "Flicker / Disappearing Message" Trap (Crucial Interview Topic)

**The Symptoms:**
When User B receives a message from User A, the notification badge updates instantly. However, inside the chat window, the message appears instantly, but then immediately disappears, only returning if the user refreshes the page.

**The Root Cause (Race Condition between WebSockets and HTTP Cache):**
When the `INSERT` WebSocket event fired, our initial logic did two things:

1. `queryClient.setQueryData(...)` -> Pushed the new message into the local array (Message appears).
2. `queryClient.invalidateQueries(...)` -> Told React Query: "Hey, data is dirty, go fetch a fresh list of messages via the REST API."

This triggered a background `GET /messages` request. However, because of aggressive HTTP caching layers (like Next.js `fetch` cache) or simple database replication propagation times, that `GET` request returned a slightly **stale** list of messages that _did not yet include the new message_.

When that REST request resolved, React Query took the stale array and overwrote our perfectly good local cache, erasing the new message from the screen.

**The Solution:**
**Trust the WebSocket payload.**
When we receive a real-time event, we already have the exact data the database just inserted (`payload.new`).
We take `payload.new`, manually append it to the chat using `queryClient.setQueryData`, and purposely **omit** calling `invalidateQueries`.

```typescript
// Inside the postgres_changes listener
const newMessage = payload.new as Message;

queryClient.setQueryData<Message[]>(["messages", conversationId], (old) => {
  if (!old) return [newMessage];
  // Prevent duplicates
  if (old.some((m) => m.id === newMessage.id)) return old;
  return [...old, newMessage];
});
// DO NOT invalidate queries here, to prevent fetching a stale HTTP response that wipes the cache!
```

---

## Summary of Best Practices for Real-Time Chat

1. **Enable Realtime**: Always verify Postgres publications (`supabase_realtime`).
2. **Aggressive Refetching**: Use `staleTime: 0` for direct navigations to chat screens.
3. **Be Optimistic**: Always update UI first, database second.
4. **Don't Double-Dip**: If your socket provides the full row data (`payload.new`), inject it locally. Don't use the socket merely as a trigger to make another HTTP fetch, as HTTP REST endpoints are incredibly prone to race conditions and caching lag.
