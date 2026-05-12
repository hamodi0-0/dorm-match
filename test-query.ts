import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!);

async function run() {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      listing:listings(title)
    `).limit(1);
  console.log(error || "Success");
}
run();
