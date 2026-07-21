// Utilidades para verificar la conexión con Supabase
import { getSupabaseClient } from "./supabase";

// Función para verificar la conexión con Supabase
export async function testSupabaseConnection() {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return {
        success: false,
        error: "Supabase no está configurado en este entorno",
      };
    }

    // Intentamos hacer una consulta simple para verificar la conexión
    const { data, error } = await supabase
      .from("quiz_participants")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Error al verificar la conexión con Supabase:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error inesperado al conectar con Supabase:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error desconocido",
    };
  }
}

// Función para verificar si las variables de entorno están configuradas
export function checkSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return {
      success: false,
      error:
        "Las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY son necesarias",
    };
  }

  return { success: true, url, key: key.substring(0, 20) + "..." };
}
