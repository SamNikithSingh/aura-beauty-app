import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data: d1, error: e1 } = await supabase.from("products").select("id").limit(1);
  console.log("Table 'products':", { data: d1, error: e1 });

  const { data: d2, error: e2 } = await supabase.from("product").select("id").limit(1);
  console.log("Table 'product':", { data: d2, error: e2 });
}

check().catch(console.error);
