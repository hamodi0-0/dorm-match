import fs from 'fs';
const file = fs.readFileSync('hooks/use-conversations.ts', 'utf-8');
const newFile = file.replace(
  /\.on\(\n\s*"postgres_changes",/g,
  `.on(\n        "broadcast",\n        { event: "new_message" },\n        (payload) => {\n          const newMessage = payload.payload as Message;\n          queryClient.invalidateQueries({ queryKey: ["conversations"] });\n          if (newMessage.conversation_id) {\n            queryClient.setQueryData<Message[]>(\n              ["messages", newMessage.conversation_id],\n              (old) => {\n                if (!old) return [newMessage];\n                if (old.some((m) => m.id === newMessage.id)) return old;\n                return [...old, newMessage];\n              }\n            );\n            queryClient.invalidateQueries({\n              queryKey: ["messages", newMessage.conversation_id],\n            });\n          }\n        }\n      )\n      .on(\n        "postgres_changes",`
);
fs.writeFileSync('hooks/use-conversations.ts', newFile);
console.log('done');
