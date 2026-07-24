import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
}

export interface AdminAccessState {
  ready: boolean;
  configured: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  adminProfile: AdminProfile | null;
  reason: string | null;
}

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getAdminAccessState(): Promise<AdminAccessState> {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient(cookieStore);

  if (!supabase) {
    return {
      ready: false,
      configured: false,
      authenticated: false,
      isAdmin: false,
      user: null,
      adminProfile: null,
      reason:
        "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY para autenticar administradores.",
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return {
      ready: false,
      configured: true,
      authenticated: false,
      isAdmin: false,
      user: null,
      adminProfile: null,
      reason: authError.message,
    };
  }

  if (!user?.email) {
    return {
      ready: true,
      configured: true,
      authenticated: false,
      isAdmin: false,
      user: null,
      adminProfile: null,
      reason: null,
    };
  }

  const adminClient = getSupabaseAdminClient();

  if (!adminClient) {
    return {
      ready: false,
      configured: false,
      authenticated: true,
      isAdmin: false,
      user: {
        id: user.id,
        email: user.email.toLowerCase(),
      },
      adminProfile: null,
      reason:
        "Falta SUPABASE_SERVICE_ROLE_KEY para validar el acceso administrativo.",
    };
  }

  const { data: adminProfile, error: adminError } = await adminClient
    .from("admin_users")
    .select("id,email,full_name,is_active")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (adminError) {
    return {
      ready: false,
      configured: false,
      authenticated: true,
      isAdmin: false,
      user: {
        id: user.id,
        email: user.email.toLowerCase(),
      },
      adminProfile: null,
      reason:
        adminError.code === "42P01"
          ? "La tabla admin_users no existe todavía. Ejecuta la migración del dashboard admin."
          : adminError.message,
    };
  }

  return {
    ready: true,
    configured: true,
    authenticated: true,
    isAdmin: Boolean(adminProfile?.is_active),
    user: {
      id: user.id,
      email: user.email.toLowerCase(),
    },
    adminProfile: adminProfile || null,
    reason: adminProfile?.is_active
      ? null
      : "Tu cuenta no está autorizada como administradora.",
  };
}

export async function requireAdminPageAccess() {
  const access = await getAdminAccessState();

  if (!access.configured) {
    return access;
  }

  if (!access.authenticated) {
    redirect("/admin/login");
  }

  if (!access.isAdmin) {
    redirect("/admin/login?error=unauthorized");
  }

  return access;
}

export async function requireAdminApiAccess() {
  const access = await getAdminAccessState();

  if (!access.configured || !access.ready) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          error:
            access.reason ||
            "La configuración administrativa de Supabase no está lista.",
        },
        { status: 503 }
      ),
    };
  }

  if (!access.authenticated) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Debes iniciar sesión para acceder al dashboard." },
        { status: 401 }
      ),
    };
  }

  if (!access.isAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Tu usuario no tiene permisos administrativos." },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true as const,
    access,
  };
}
