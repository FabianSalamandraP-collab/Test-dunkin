import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { AuthSessionMissingError, isAuthError } from "@supabase/supabase-js";
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

type SafeAdminAuthDiag =
  | {
      case: "A_NO_SESSION";
      authenticated: false;
      serviceRoleConfigured: boolean;
      authErrorMissing: boolean;
      authErrorMessage?: string;
      isAdmin: false;
      finalReason: string | null;
    }
  | {
      case: "B_AUTH_BUT_SERVICE_ROLE_MISSING";
      authenticated: true;
      userId: string;
      userEmail: string;
      normalizedEmail: string;
      serviceRoleConfigured: boolean;
      isAdmin: false;
      finalReason: string | null;
    }
  | {
      case: "C_ADMIN_QUERY_ERROR";
      authenticated: true;
      userId: string;
      userEmail: string;
      normalizedEmail: string;
      serviceRoleConfigured: boolean;
      adminQueryError: string;
      adminErrorCode?: string;
      isAdmin: false;
      finalReason: string | null;
    }
  | {
      case: "D_ADMIN_PROFILE_NOT_FOUND";
      authenticated: true;
      userId: string;
      userEmail: string;
      normalizedEmail: string;
      serviceRoleConfigured: boolean;
      adminQueryFound: false;
      adminProfileEmail: null;
      adminProfileIsActive: null;
      isAdmin: false;
      finalReason: string | null;
    }
  | {
      case: "E_ADMIN_PROFILE_INACTIVE";
      authenticated: true;
      userId: string;
      userEmail: string;
      normalizedEmail: string;
      serviceRoleConfigured: boolean;
      adminQueryFound: true;
      adminProfileEmail: string | null;
      adminProfileIsActive: boolean | null;
      isAdmin: false;
      finalReason: string | null;
    }
  | {
      case: "F_AUTHORIZED_OK";
      authenticated: true;
      userId: string;
      userEmail: string;
      normalizedEmail: string;
      serviceRoleConfigured: boolean;
      adminQueryFound: true;
      adminProfileEmail: string | null;
      adminProfileIsActive: boolean | null;
      isAdmin: true;
      finalReason: string | null;
    };

function logSafeAdminAuthDiag(diag: SafeAdminAuthDiag) {
  try {
    const tag = "[admin-auth][diag]";
    switch (diag.case) {
      case "A_NO_SESSION":
        console.log(tag, {
          case: diag.case,
          authenticated: diag.authenticated,
          serviceRoleConfigured: diag.serviceRoleConfigured,
          authErrorMissing: diag.authErrorMissing,
          authErrorMessage: diag.authErrorMessage,
          isAdmin: diag.isAdmin,
          finalReason: diag.finalReason,
        });
        break;
      case "B_AUTH_BUT_SERVICE_ROLE_MISSING":
        console.log(tag, {
          case: diag.case,
          authenticated: diag.authenticated,
          userId: diag.userId,
          userEmail: diag.userEmail,
          normalizedEmail: diag.normalizedEmail,
          serviceRoleConfigured: diag.serviceRoleConfigured,
          isAdmin: diag.isAdmin,
          finalReason: diag.finalReason,
        });
        break;
      case "C_ADMIN_QUERY_ERROR":
        console.log(tag, {
          case: diag.case,
          authenticated: diag.authenticated,
          userId: diag.userId,
          userEmail: diag.userEmail,
          normalizedEmail: diag.normalizedEmail,
          serviceRoleConfigured: diag.serviceRoleConfigured,
          adminQueryError: diag.adminQueryError,
          adminErrorCode: diag.adminErrorCode,
          isAdmin: diag.isAdmin,
          finalReason: diag.finalReason,
        });
        break;
      case "D_ADMIN_PROFILE_NOT_FOUND":
      case "E_ADMIN_PROFILE_INACTIVE":
      case "F_AUTHORIZED_OK":
        console.log(tag, {
          case: diag.case,
          authenticated: diag.authenticated,
          userId: diag.userId,
          userEmail: diag.userEmail,
          normalizedEmail: diag.normalizedEmail,
          serviceRoleConfigured: diag.serviceRoleConfigured,
          adminQueryFound: diag.adminQueryFound,
          adminProfileEmail: diag.adminProfileEmail,
          adminProfileIsActive: diag.adminProfileIsActive,
          isAdmin: diag.isAdmin,
          finalReason: diag.finalReason,
        });
        break;
    }
  } catch {
    // Never throw during diagnostics
  }
}

export async function getAdminAccessState(): Promise<AdminAccessState> {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient(cookieStore);
  const serviceRoleConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabase) {
    const result = {
      ready: false,
      configured: false,
      authenticated: false,
      isAdmin: false,
      user: null,
      adminProfile: null,
      reason:
        "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY para autenticar administradores.",
    };

    logSafeAdminAuthDiag({
      case: "A_NO_SESSION",
      authenticated: false,
      serviceRoleConfigured,
      authErrorMissing: false,
      authErrorMessage: result.reason,
      isAdmin: false,
      finalReason: result.reason,
    });

    return result;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    const isMissingSession =
      authError instanceof AuthSessionMissingError ||
      authError.message === "Auth session missing!" ||
      (isAuthError(authError) && authError.name === "AuthSessionMissingError");

    if (isMissingSession) {
      const result = {
        ready: true,
        configured: true,
        authenticated: false,
        isAdmin: false,
        user: null,
        adminProfile: null,
        reason: null,
      };

      logSafeAdminAuthDiag({
        case: "A_NO_SESSION",
        authenticated: false,
        serviceRoleConfigured,
        authErrorMissing: true,
        authErrorMessage: authError.message,
        isAdmin: false,
        finalReason: result.reason,
      });

      return result;
    }

    const result = {
      ready: false,
      configured: true,
      authenticated: false,
      isAdmin: false,
      user: null,
      adminProfile: null,
      reason: authError.message,
    };

    logSafeAdminAuthDiag({
      case: "A_NO_SESSION",
      authenticated: false,
      serviceRoleConfigured,
      authErrorMissing: false,
      authErrorMessage: authError.message,
      isAdmin: false,
      finalReason: result.reason,
    });

    return result;
  }

  if (!user?.email) {
    const result = {
      ready: true,
      configured: true,
      authenticated: false,
      isAdmin: false,
      user: null,
      adminProfile: null,
      reason: null,
    };

    logSafeAdminAuthDiag({
      case: "A_NO_SESSION",
      authenticated: false,
      serviceRoleConfigured,
      authErrorMissing: false,
      authErrorMessage: "auth_getUser_returned_no_email",
      isAdmin: false,
      finalReason: result.reason,
    });

    return result;
  }

  const normalizedEmail = user.email.toLowerCase();
  const adminClient = getSupabaseAdminClient();

  if (!adminClient) {
    const result = {
      ready: false,
      configured: false,
      authenticated: true,
      isAdmin: false,
      user: {
        id: user.id,
        email: normalizedEmail,
      },
      adminProfile: null,
      reason:
        "Falta SUPABASE_SERVICE_ROLE_KEY para validar el acceso administrativo.",
    };

    logSafeAdminAuthDiag({
      case: "B_AUTH_BUT_SERVICE_ROLE_MISSING",
      authenticated: true,
      userId: user.id,
      userEmail: user.email,
      normalizedEmail,
      serviceRoleConfigured,
      isAdmin: false,
      finalReason: result.reason,
    });

    return result;
  }

  const { data: adminProfile, error: adminError } = await adminClient
    .from("admin_users")
    .select("id,email,full_name,is_active")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (adminError) {
    const reason =
      adminError.code === "42P01"
        ? "La tabla admin_users no existe todavía. Ejecuta la migración del dashboard admin."
        : adminError.message;

    const result = {
      ready: false,
      configured: false,
      authenticated: true,
      isAdmin: false,
      user: {
        id: user.id,
        email: normalizedEmail,
      },
      adminProfile: null,
      reason,
    };

    logSafeAdminAuthDiag({
      case: "C_ADMIN_QUERY_ERROR",
      authenticated: true,
      userId: user.id,
      userEmail: user.email,
      normalizedEmail,
      serviceRoleConfigured,
      adminQueryError: adminError.message,
      adminErrorCode:
        "code" in (adminError as unknown as Record<string, unknown>)
          ? ((adminError as unknown as { code?: string }).code ?? undefined)
          : undefined,
      isAdmin: false,
      finalReason: result.reason,
    });

    return result;
  }

  if (!adminProfile) {
    const result = {
      ready: true,
      configured: true,
      authenticated: true,
      isAdmin: false,
      user: {
        id: user.id,
        email: normalizedEmail,
      },
      adminProfile: null,
      reason: "Tu cuenta no está autorizada como administradora.",
    };

    logSafeAdminAuthDiag({
      case: "D_ADMIN_PROFILE_NOT_FOUND",
      authenticated: true,
      userId: user.id,
      userEmail: user.email,
      normalizedEmail,
      serviceRoleConfigured,
      adminQueryFound: false,
      adminProfileEmail: null,
      adminProfileIsActive: null,
      isAdmin: false,
      finalReason: result.reason,
    });

    return result;
  }

  const isAdminFinal = Boolean(adminProfile?.is_active);
  const finalReason = isAdminFinal
    ? null
    : "Tu cuenta no está autorizada como administradora.";

  const result = {
    ready: true,
    configured: true,
    authenticated: true,
    isAdmin: isAdminFinal,
    user: {
      id: user.id,
      email: normalizedEmail,
    },
    adminProfile: adminProfile || null,
    reason: finalReason,
  };

  if (isAdminFinal) {
    logSafeAdminAuthDiag({
      case: "F_AUTHORIZED_OK",
      authenticated: true,
      userId: user.id,
      userEmail: user.email,
      normalizedEmail,
      serviceRoleConfigured,
      adminQueryFound: true,
      adminProfileEmail: adminProfile?.email ?? null,
      adminProfileIsActive: adminProfile?.is_active ?? null,
      isAdmin: true,
      finalReason,
    });
  } else {
    logSafeAdminAuthDiag({
      case: "E_ADMIN_PROFILE_INACTIVE",
      authenticated: true,
      userId: user.id,
      userEmail: user.email,
      normalizedEmail,
      serviceRoleConfigured,
      adminQueryFound: true,
      adminProfileEmail: adminProfile?.email ?? null,
      adminProfileIsActive: adminProfile?.is_active ?? null,
      isAdmin: false,
      finalReason,
    });
  }

  return result;
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
