// Cliente de Supabase para la campaña de Dunkin Colombia
import { createClient } from "@supabase/supabase-js";

// Variables de entorno (debes configurarlas en tu archivo .env.local)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
  },
});
