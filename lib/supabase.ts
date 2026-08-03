// Cliente de Supabase para la campaña de Dunkin' Colombia
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "@/utils/supabase/client";

let browserSupabaseClient: SupabaseClient | null = null;

// Crea el cliente solo cuando realmente se necesita para no romper el build
export function getSupabaseClient() {
  if (!browserSupabaseClient) {
    browserSupabaseClient = createBrowserClient();
  }

  return browserSupabaseClient;
}
