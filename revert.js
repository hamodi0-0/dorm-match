import fs from 'fs';

let msgInput = fs.readFileSync('components/chats/message-input.tsx', 'utf-8');
msgInput = msgInput.replace(/\/\/ Broadcast this message so the other user gets it even if Supabase Realtime drops the WAL event due to joined RLS limitations[\s\S]*?\/\/ Also update the updated_at on the conversation so it moves to top/, '// Also update the updated_at on the conversation so it moves to top');
fs.writeFileSync('components/chats/message-input.tsx', msgInput);

let useConv = fs.readFileSync('hooks/use-conversations.ts', 'utf-8');
useConv = useConv.replace(/\.on\(\s*"broadcast",[\s\S]*?\.on\(\s*"postgres_changes",/, '.on(\n        "postgres_changes",');
fs.writeFileSync('hooks/use-conversations.ts', useConv);
