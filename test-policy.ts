import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
async function run() {
  const { data, error } = await supabase.from('pg_policies').select('*').eq('tablename', 'messages');
  console.log(data || error);
}
run();
