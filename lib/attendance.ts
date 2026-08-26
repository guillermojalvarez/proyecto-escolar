import { ASISTENCIA_DETALLE, HOY } from "@/lib/mock-data";
import type {
  AsistenciaDetalle,
  EstadoCalendario,
  ListaAsistenciaDia,
} from "@/lib/types";
import { C } from "@/lib/theme";

export function fechaToISO(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISOFecha(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

/** Días hábiles del mes de la demo hasta HOY (inclusive). */
export function diasHabilesHastaHoy(): {
  iso: string;
  dia: number;
  label: string;
  esHoy: boolean;
}[] {
  const anio = HOY.getFullYear();
  const mes = HOY.getMonth();
  const max = HOY.getDate();
  const hoyIso = fechaToISO(HOY);
  const out: { iso: string; dia: number; label: string; esHoy: boolean }[] = [];
  for (let d = 1; d <= max; d++) {
    const fecha = new Date(anio, mes, d);
    const wd = fecha.getDay();
    if (wd === 0 || wd === 6) continue;
    const iso = fechaToISO(fecha);
    out.push({
      iso,
      dia: d,
      esHoy: iso === hoyIso,
      label: fecha.toLocaleDateString("es-MX", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    });
  }
  return out;
}

export function listaDesdeDetalle(
  alumnoIds: string[],
  detalle: AsistenciaDetalle,
  diaDelMes: number
): ListaAsistenciaDia {
  const lista: ListaAsistenciaDia = {};
  for (const id of alumnoIds) {
    const e = detalle[id]?.[diaDelMes];
    lista[id] =
      e === "falta" || e === "retardo" ? "falta" : e === "presente" ? "presente" : "presente";
  }
  return lista;
}

export function estadoDelDia(
  hijoId: string,
  fecha: Date,
  overrides?: AsistenciaDetalle
): EstadoCalendario {
  if (fecha > HOY) return "pendiente";
  const diaSemana = fecha.getDay();
  if (diaSemana === 0 || diaSemana === 6) return "noclase";
  const mapa = overrides ?? ASISTENCIA_DETALLE;
  const diaOverrides = mapa[hijoId] || {};
  return diaOverrides[fecha.getDate()] || "presente";
}

export function matrizDelMes(anio: number, mes: number): (number | null)[][] {
  const primerDia = new Date(anio, mes, 1);
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const offset = (primerDia.getDay() + 6) % 7;
  const celdas: (number | null)[] = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null);
  const semanas: (number | null)[][] = [];
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7));
  return semanas;
}

export function pctAsistenciaGrupo(grupo: string, dia: number): number {
  const seed = grupo.charCodeAt(0) * 3 + grupo.charCodeAt(grupo.length - 1) * 7 + dia * 5;
  return 90 + (seed % 9);
}

export function bandaPct(pct: number): { color: string; bg: string } {
  if (pct >= 97) return { color: C.green, bg: C.greenSoft };
  if (pct >= 93) return { color: C.gold, bg: C.goldSoft };
  return { color: C.red, bg: C.redSoft };
}
