import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Cliente Supabase; solo disponible si URL y anon key están en .env.local */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
