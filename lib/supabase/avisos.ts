import { supabase, isSupabaseConfigured } from "./client";
import type { Aviso, TipoAviso } from "@/lib/types";

function logError(context: string, error: unknown): void {
  const msg =
    error && typeof error === "object" && "message" in error
      ? (error as { message?: string }).message
      : String(error);
  console.warn(`[Supabase] ${context}:`, msg);
}

export async function fetchAvisos(): Promise<Aviso[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from("avisos")
      .select("tipo, titulo, cuerpo, fecha")
      .order("created_at", { ascending: false });

    if (error) {
      logError("fetchAvisos", error);
      return [];
    }

    return (data || []).map((row) => ({
      tipo: (row.tipo as TipoAviso) || "info",
      titulo: String(row.titulo ?? ""),
      cuerpo: String(row.cuerpo ?? ""),
      fecha: String(row.fecha ?? ""),
    }));
  } catch (e) {
    logError("fetchAvisos", e);
    return [];
  }
}
