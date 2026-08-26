import { supabase, isSupabaseConfigured } from "./client";
import type { ReporteConducta, TipoConducta } from "@/lib/types";

function logError(context: string, error: unknown): void {
  const msg =
    error && typeof error === "object" && "message" in error
      ? (error as { message?: string }).message
      : String(error);
  console.warn(`[Supabase] ${context}:`, msg);
}

export async function fetchReportesConducta(
  alumnoId: string
): Promise<ReporteConducta[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from("reportes_conducta")
      .select("tipo, fecha, titulo, detalle, reporta")
      .eq("alumno_id", alumnoId)
      .order("created_at", { ascending: false });

    if (error) {
      logError("fetchReportesConducta", error);
      return [];
    }

    return (data || []).map((row) => ({
      tipo: (row.tipo as TipoConducta) || "positivo",
      fecha: String(row.fecha ?? ""),
      titulo: String(row.titulo ?? ""),
      detalle: String(row.detalle ?? ""),
      reporta: String(row.reporta ?? ""),
    }));
  } catch (e) {
    logError("fetchReportesConducta", e);
    return [];
  }
}
