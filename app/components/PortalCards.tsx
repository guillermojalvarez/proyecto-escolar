"use client";

import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Info,
  PartyPopper,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { C } from "@/lib/theme";
import { estadoDelDia, matrizDelMes } from "@/lib/attendance";
import { CalendarioMensual } from "@/app/components/ui";
import { useApp } from "@/app/providers/AppProvider";

const AVISO_ESTILO = {
  urgente: { icon: AlertTriangle, color: C.red, bg: C.redSoft },
  evento: { icon: PartyPopper, color: C.gold, bg: C.goldSoft },
  info: { icon: Info, color: C.ink, bg: "#E6E9E2" },
} as const;

const CONDUCTA_ESTILO = {
  positivo: { icon: ThumbsUp, color: C.green, bg: C.greenSoft },
  negativo: { icon: ThumbsDown, color: C.red, bg: C.redSoft },
} as const;

const ESTILO_CALENDARIO = {
  presente: { color: C.green, bg: C.greenSoft },
  falta: { color: C.red, bg: C.redSoft },
  retardo: { color: C.gold, bg: C.goldSoft },
  noclase: { color: C.inkSoft, bg: "transparent" },
  pendiente: { color: C.inkSoft, bg: C.paper },
} as const;

export function AvisosCard() {
  const { avisos } = useApp();
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={16} color={C.ink} />
        <span style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }} className="font-semibold">
          Avisos
        </span>
      </div>
      <div className="space-y-2">
        {avisos.map((a) => {
          const est = AVISO_ESTILO[a.tipo];
          const Icon = est.icon;
          return (
            <div key={a.titulo} style={{ background: est.bg }} className="rounded-md p-3 flex gap-2.5">
              <Icon size={16} color={est.color} className="shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p style={{ color: C.ink }} className="text-sm font-medium">
                    {a.titulo}
                  </p>
                  <span
                    style={{ color: est.color, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
                    className="text-[10px]"
                  >
                    {a.fecha}
                  </span>
                </div>
                <p style={{ color: C.inkSoft }} className="text-xs mt-0.5">
                  {a.cuerpo}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AgendaCard() {
  const { eventos } = useApp();
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={16} color={C.ink} />
        <span style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }} className="font-semibold">
          Próximos eventos
        </span>
      </div>
      <div>
        {eventos.map((e, i) => (
          <div
            key={e.titulo}
            style={{ borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}
            className="flex items-center gap-3 py-2.5"
          >
            <div
              style={{
                background: C.paper,
                color: C.ink,
                fontFamily: "var(--font-ibm-plex-mono), monospace",
              }}
              className="rounded-md w-12 h-12 flex flex-col items-center justify-center shrink-0"
            >
              <span className="text-[10px] leading-none">{e.dia}</span>
              <span className="text-sm font-semibold leading-none mt-1">
                {e.fecha.split(" ")[0]}
              </span>
            </div>
            <p style={{ color: C.ink }} className="text-sm">
              {e.titulo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportesConductaCard({ hijoId }: { hijoId: string }) {
  const { reportes: reportesMap } = useApp();
  const reportes = reportesMap[hijoId] || [];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <ThumbsUp size={16} color={C.ink} />
        <span style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }} className="font-semibold">
          Reportes de conducta
        </span>
      </div>
      {reportes.length === 0 && (
        <p style={{ color: C.inkSoft }} className="text-sm">
          Sin reportes registrados este periodo.
        </p>
      )}
      <div className="space-y-2">
        {reportes.map((r) => {
          const est = CONDUCTA_ESTILO[r.tipo];
          const Icon = est.icon;
          return (
            <div key={`${r.fecha}-${r.titulo}`} style={{ background: est.bg }} className="rounded-md p-3 flex gap-2.5">
              <Icon size={16} color={est.color} className="shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p style={{ color: C.ink }} className="text-sm font-medium">
                    {r.titulo}
                  </p>
                  <span
                    style={{ color: est.color, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
                    className="text-[10px]"
                  >
                    {r.fecha}
                  </span>
                </div>
                <p style={{ color: C.inkSoft }} className="text-xs mt-0.5">
                  {r.detalle}
                </p>
                <p style={{ color: est.color }} className="text-[11px] mt-1">
                  Registró: {r.reporta}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AsistenciaCard({ hijoId }: { hijoId: string }) {
  const { asistenciaDetalle } = useApp();
  const semanas = matrizDelMes(2026, 6);
  const faltas = semanas
    .flat()
    .filter(
      (d) => d && estadoDelDia(hijoId, new Date(2026, 6, d), asistenciaDetalle) === "falta"
    ).length;
  const retardos = semanas
    .flat()
    .filter(
      (d) => d && estadoDelDia(hijoId, new Date(2026, 6, d), asistenciaDetalle) === "retardo"
    ).length;

  return (
    <div>
      <CalendarioMensual
        titulo="Asistencia"
        semanas={semanas}
        leyenda={[
          { color: C.green, label: "Presente" },
          { color: C.red, label: "Falta" },
          { color: C.gold, label: "Retardo" },
        ]}
        renderCelda={(dia) => {
          const fecha = new Date(2026, 6, dia);
          const estado = estadoDelDia(hijoId, fecha, asistenciaDetalle);
          const est = ESTILO_CALENDARIO[estado];
          return (
            <div
              style={{
                background: est.bg,
                color: estado === "noclase" ? C.inkSoft : est.color,
                border:
                  estado === "presente" || estado === "falta" || estado === "retardo"
                    ? `1px solid ${est.color}`
                    : "none",
              }}
              className="w-full h-full rounded-md flex items-center justify-center text-[11px] font-medium"
            >
              {dia}
            </div>
          );
        }}
      />
      <p style={{ color: C.inkSoft }} className="text-xs mt-2 px-1">
        {faltas} falta{faltas !== 1 ? "s" : ""} · {retardos} retardo
        {retardos !== 1 ? "s" : ""} este mes
      </p>
    </div>
  );
}
