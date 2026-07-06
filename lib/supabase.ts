// Cliente de Supabase para la campaña de Dunkin Colombia
import { createClient as createBrowserClient } from "@/utils/supabase/client";

// Cliente de Supabase (para uso en componentes de cliente)
export const supabase = createBrowserClient();
