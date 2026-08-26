import { supabase, isSupabaseConfigured } from "./client";
import type { Role, User } from "@/lib/types";

function logError(context: string, error: unknown): void {
  const msg =
    error && typeof error === "object" && "message" in error
      ? (error as { message?: string }).message
      : String(error);
  console.warn(`[Supabase] ${context}:`, msg);
}

export async function fetchProfile(userId: string): Promise<User | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, display_name, email, alumno_clave")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      logError("fetchProfile", error);
      return null;
    }
    if (!data) return null;

    return {
      id: String(data.id),
      name: String(data.display_name ?? ""),
      role: data.role as Role,
      email: data.email ? String(data.email) : undefined,
      alumnoClave: data.alumno_clave ? String(data.alumno_clave) : undefined,
    };
  } catch (e) {
    logError("fetchProfile", e);
    return null;
  }
}
