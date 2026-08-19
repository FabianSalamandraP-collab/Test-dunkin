import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function baseResponse(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const createClient = async (request: NextRequest) => {
  let supabaseResponse = baseResponse(request);

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
      cookies: {
        getAll() {
          try {
            return request.cookies.getAll();
          } catch {
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            if (!cookiesToSet || cookiesToSet.length === 0) {
              return;
            }
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                supabaseResponse.cookies.set(name, value, options);
              } catch {
                // ignore individual cookie write errors so middleware never crashes
              }
            });
          } catch {
            // ignore cookie refresh errors so middleware never crashes
          }
        },
      },
    });

    const pathname = request.nextUrl.pathname;
    const isAdminRoute = pathname.startsWith("/admin");
    const isAdminApiRoute = pathname.startsWith("/api/admin");
    const isAdminLoginRoute = pathname === "/admin/login";

    if (!isAdminRoute && !isAdminApiRoute) {
      return supabaseResponse;
    }

    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user ?? null;
    } catch {
      user = null;
    }

    if (user) {
      return supabaseResponse;
    }

    if (isAdminApiRoute) {
      return NextResponse.json(
        {
          error: "Debes iniciar sesión para acceder a esta ruta administrativa.",
        },
        { status: 401 }
      );
    }

    if (!isAdminLoginRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  } catch {
    return baseResponse(request);
  }
};
