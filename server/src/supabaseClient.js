import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_KEY environment variables.\n" +
      "Copy server/.env.example to server/.env and fill in your Supabase project's URL and service_role key."
  );
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
