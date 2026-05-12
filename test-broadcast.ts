import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!);
const channel = supabase.channel("realtime:all-messages");
channel.subscribe((status) => {
  if (status === 'SUBSCRIBED') {
    channel.send({ type: 'broadcast', event: 'test', payload: { a: 1 } }).then(console.log).catch(console.error);
    setTimeout(() => process.exit(0), 1000);
  }
});
