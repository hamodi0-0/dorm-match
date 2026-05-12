import fs from 'fs';
let file = fs.readFileSync('components/chats/message-input.tsx', 'utf-8');
file = file.replace(
  /\/\/ Also update the updated_at on the conversation so it moves to top/,
  `// Broadcast this message so the other user gets it even if Supabase Realtime drops the WAL event due to joined RLS limitations\n        const broadcastChannel = supabase.channel("realtime:all-messages");\n        broadcastChannel.subscribe((status) => {\n          if (status === 'SUBSCRIBED' || status === 'TIMED_OUT') {\n            broadcastChannel.send({\n              type: "broadcast",\n              event: "new_message",\n              payload: newMessage\n            });\n          }\n        });\n\n        // Also update the updated_at on the conversation so it moves to top`
);
fs.writeFileSync('components/chats/message-input.tsx', file);
console.log('done2');
