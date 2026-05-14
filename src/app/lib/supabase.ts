import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are loaded correctly in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.");
}

/**
 * Supabase client instance for authentication and database interaction.
 * Initialized with environment variables from Vite.
 */
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
