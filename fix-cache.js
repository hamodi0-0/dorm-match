import fs from 'fs';

let useMsgs = fs.readFileSync('hooks/use-messages.ts', 'utf-8');
useMsgs = useMsgs.replace(
  /queryClient\.invalidateQueries\(\{\s*queryKey:\s*\["messages",\s*conversationId\],\s*\}\);/g,
  `// Skipped invalidation to avoid fetching stale data\n          // queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });`
);
fs.writeFileSync('hooks/use-messages.ts', useMsgs);

let useConv = fs.readFileSync('hooks/use-conversations.ts', 'utf-8');
useConv = useConv.replace(
  /queryClient\.invalidateQueries\(\{\s*queryKey:\s*\["messages",\s*\(payload\.new\s*as\s*any\)\.conversation_id\],\s*\}\);/g,
  `// Skipped invalidation to avoid stale fetch\n            // queryClient.invalidateQueries({ queryKey: ["messages", (payload.new as any).conversation_id] });`
);
fs.writeFileSync('hooks/use-conversations.ts', useConv);

console.log("Replaced invalidations.");
