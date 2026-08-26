import { supabase, isSupabaseConfigured } from "./client";
import type { AsistenciaDetalle, EstadoAsistencia, ListaAsistenciaDia } from "@/lib/types";

function logError(context: string, error: unknown): void {
  const msg =
    error && typeof error === "object" && "message" in error
      ? (error as { message?: string }).message
      : String(error);
  console.warn(`[Supabase] ${context}:`, msg);
}

export async function fetchListaAsistencia(
  grupo: string,
  fecha: string
): Promise<ListaAsistenciaDia> {
  if (!isSupabaseConfigured() || !supabase) return {};
  try {
    const { data, error } = await supabase
      .from("asistencias")
      .select("alumno_id, estado")
      .eq("grupo", grupo)
      .eq("fecha", fecha);

    if (error) {
      logError("fetchListaAsistencia", error);
      return {};
    }

    const lista: ListaAsistenciaDia = {};
    for (const row of data || []) {
      lista[String(row.alumno_id)] = row.estado as EstadoAsistencia;
    }
    return lista;
  } catch (e) {
    logError("fetchListaAsistencia", e);
    return {};
  }
}

/** Historial de asistencia para el calendario (por alumno y día del mes). */
export async function fetchAsistenciaDetalle(
  alumnoIds: string[],
  anio = 2026,
  mes = 6
): Promise<AsistenciaDetalle> {
  if (!isSupabaseConfigured() || !supabase || alumnoIds.length === 0) return {};
  try {
    const inicio = `${anio}-${String(mes + 1).padStart(2, "0")}-01`;
    const finDate = new Date(anio, mes + 1, 0);
    const fin = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(finDate.getDate()).padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("asistencias")
      .select("alumno_id, fecha, estado")
      .in("alumno_id", alumnoIds)
      .gte("fecha", inicio)
      .lte("fecha", fin);

    if (error) {
      logError("fetchAsistenciaDetalle", error);
      return {};
    }

    const detalle: AsistenciaDetalle = {};
    for (const row of data || []) {
      const id = String(row.alumno_id);
      const fecha = new Date(`${row.fecha}T12:00:00`);
      if (Number.isNaN(fecha.getTime())) continue;
      if (!detalle[id]) detalle[id] = {};
      detalle[id][fecha.getDate()] = row.estado as EstadoAsistencia;
    }
    return detalle;
  } catch (e) {
    logError("fetchAsistenciaDetalle", e);
    return {};
  }
}

export async function saveListaAsistencia(
  grupo: string,
  fecha: string,
  lista: ListaAsistenciaDia
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return true;
  try {
    const rows = Object.entries(lista).map(([alumno_id, estado]) => ({
      alumno_id,
      grupo,
      fecha,
      estado,
    }));

    const { error } = await supabase.from("asistencias").upsert(rows, {
      onConflict: "alumno_id,fecha",
    });

    if (error) {
      logError("saveListaAsistencia", error);
      return false;
    }
    return true;
  } catch (e) {
    logError("saveListaAsistencia", e);
    return false;
  }
}
