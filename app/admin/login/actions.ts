"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function adminLogin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || email.trim().length === 0) {
    return {
      error: "El correo es obligatorio.",
    };
  }

  if (typeof password !== "string" || password.length === 0) {
    return {
      error: "La contraseña es obligatoria.",
    };
  }

  const emailValue = email.trim().toLowerCase();

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    if (!supabase) {
      return {
        error:
          "No hay configuración pública de Supabase disponible en este entorno.",
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password,
    });

    if (error) {
      return {
        error: error.message,
      };
    }

    return {
      success: true as const,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No fue posible iniciar sesión en este momento.";

    return {
      error: message,
    };
  }
}
