import { supabase, isSupabaseConfigured } from "./client";
import type { EventoAgenda } from "@/lib/types";

function logError(context: string, error: unknown): void {
  const msg =
    error && typeof error === "object" && "message" in error
      ? (error as { message?: string }).message
      : String(error);
  console.warn(`[Supabase] ${context}:`, msg);
}

export async function fetchEventosAgenda(): Promise<EventoAgenda[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from("eventos_agenda")
      .select("fecha, dia, titulo")
      .order("created_at", { ascending: true });

    if (error) {
      logError("fetchEventosAgenda", error);
      return [];
    }

    return (data || []).map((row) => ({
      fecha: String(row.fecha ?? ""),
      dia: String(row.dia ?? ""),
      titulo: String(row.titulo ?? ""),
    }));
  } catch (e) {
    logError("fetchEventosAgenda", e);
    return [];
  }
}
