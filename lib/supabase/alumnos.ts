import { supabase, isSupabaseConfigured } from "./client";
import type { Alumno, MateriaCalificacion } from "@/lib/types";

function logError(context: string, error: unknown): void {
  const msg =
    error && typeof error === "object" && "message" in error
      ? (error as { message?: string }).message
      : String(error);
  console.warn(`[Supabase] ${context}:`, msg);
}

export async function fetchAlumnosByTutor(tutorId: string): Promise<Alumno[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  try {
    const { data: links, error: linkError } = await supabase
      .from("tutores_alumnos")
      .select("alumno_id")
      .eq("tutor_id", tutorId);

    if (linkError) {
      logError("fetchAlumnosByTutor.links", linkError);
      return [];
    }

    const ids = (links || []).map((l) => String(l.alumno_id));
    if (ids.length === 0) return [];

    const { data: alumnos, error } = await supabase
      .from("alumnos")
      .select("id, nombre, grupo, asesor")
      .in("id", ids);

    if (error) {
      logError("fetchAlumnosByTutor.alumnos", error);
      return [];
    }

    const result: Alumno[] = [];
    for (const a of alumnos || []) {
      const materias = await fetchCalificaciones(String(a.id));
      result.push({
        id: String(a.id),
        nombre: String(a.nombre ?? ""),
        grupo: String(a.grupo ?? ""),
        asesor: String(a.asesor ?? ""),
        materias,
      });
    }
    return result;
  } catch (e) {
    logError("fetchAlumnosByTutor", e);
    return [];
  }
}

async function fetchCalificaciones(alumnoId: string): Promise<MateriaCalificacion[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("calificaciones")
    .select("materia, p1, p2, p3")
    .eq("alumno_id", alumnoId);

  if (error) {
    logError("fetchCalificaciones", error);
    return [];
  }

  return (data || []).map((row) => ({
    materia: String(row.materia ?? ""),
    p1: Number(row.p1 ?? 0),
    p2: Number(row.p2 ?? 0),
    p3: Number(row.p3 ?? 0),
  }));
}
