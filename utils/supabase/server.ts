import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function isServerComponentCookieError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Cookies can only be modified in a Server Action") ||
    message.includes("Server Components may not modify cookies") ||
    message.includes("can only be set in a Server Action") ||
    message.includes("read-only")
  );
}

export const createClient = (
  cookieStore: Awaited<ReturnType<typeof cookies>>
): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      async setAll(cookiesToSet) {
        try {
          const runtimeCookieStore = await cookies();
          for (const { name, value, options } of cookiesToSet) {
            runtimeCookieStore.set(name, value, options);
          }
        } catch (error) {
          if (isServerComponentCookieError(error)) {
            return;
          }
          throw error;
        }
      },
    },
  });
};
