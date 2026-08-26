"use client";

import type { ReactNode } from "react";
import { C } from "@/lib/theme";
import { NOMBRE_MES } from "@/lib/mock-data";

export function GridPaper({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
        backgroundColor: C.paper,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CalifPill({ valor }: { valor: number }) {
  const aprobado = valor >= 6;
  return (
    <span
      style={{
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        fontWeight: 600,
        color: aprobado ? C.green : C.red,
        border: `1.5px solid ${aprobado ? C.green : C.red}`,
        borderRadius: "999px",
        padding: "2px 10px",
        fontSize: "0.85rem",
        display: "inline-block",
        minWidth: 44,
        textAlign: "center",
      }}
    >
      {valor.toFixed(1)}
    </span>
  );
}

export function CalendarioMensual({
  titulo,
  semanas,
  renderCelda,
  leyenda,
}: {
  titulo: string;
  semanas: (number | null)[][];
  renderCelda: (dia: number) => ReactNode;
  leyenda?: { color: string; label: string }[];
}) {
  const dias = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span
          style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }}
          className="font-semibold capitalize"
        >
          {titulo}
        </span>
        <span
          style={{ color: C.inkSoft, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
          className="text-xs capitalize"
        >
          {NOMBRE_MES}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dias.map((d, i) => (
          <div
            key={`${d}-${i}`}
            style={{ color: C.inkSoft }}
            className="text-center text-[10px] font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {semanas.map((semana, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {semana.map((dia, di) => (
              <div key={di} className="aspect-square">
                {dia && renderCelda(dia)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {leyenda && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
          {leyenda.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span style={{ background: l.color, width: 8, height: 8, borderRadius: "50%" }} />
              <span style={{ color: C.inkSoft }} className="text-[11px]">
                {l.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
