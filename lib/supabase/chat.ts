import { supabase, isSupabaseConfigured } from "./client";
import type { ChatsPorAlumno, MensajeChat } from "@/lib/types";

function logError(context: string, error: unknown): void {
  const msg =
    error && typeof error === "object" && "message" in error
      ? (error as { message?: string }).message
      : String(error);
  console.warn(`[Supabase] ${context}:`, msg);
}

export async function fetchMensajesChat(alumnoIds: string[]): Promise<ChatsPorAlumno> {
  if (!isSupabaseConfigured() || !supabase || alumnoIds.length === 0) return {};
  try {
    const { data, error } = await supabase
      .from("mensajes_chat")
      .select("alumno_id, de, texto, hora, created_at")
      .in("alumno_id", alumnoIds)
      .order("created_at", { ascending: true });

    if (error) {
      logError("fetchMensajesChat", error);
      return {};
    }

    const chats: ChatsPorAlumno = {};
    for (const row of data || []) {
      const id = String(row.alumno_id);
      if (!chats[id]) chats[id] = [];
      chats[id].push({
        de: row.de as MensajeChat["de"],
        texto: String(row.texto ?? ""),
        hora: String(row.hora ?? ""),
      });
    }
    return chats;
  } catch (e) {
    logError("fetchMensajesChat", e);
    return {};
  }
}

export async function saveMensajeChat(
  alumnoId: string,
  mensaje: MensajeChat
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return true;
  try {
    const { error } = await supabase.from("mensajes_chat").insert({
      alumno_id: alumnoId,
      de: mensaje.de,
      texto: mensaje.texto,
      hora: mensaje.hora,
    });
    if (error) {
      logError("saveMensajeChat", error);
      return false;
    }
    return true;
  } catch (e) {
    logError("saveMensajeChat", e);
    return false;
  }
}
