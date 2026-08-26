"use client";

import { useEffect } from "react";
import { GraduationCap, Printer, X } from "lucide-react";
import type { Alumno } from "@/lib/types";
import { C, ESCUELA } from "@/lib/theme";

function BoletaDocumento({ hijo }: { hijo: Alumno }) {
  const promedios = hijo.materias.map((m) => (m.p1 + m.p2 + m.p3) / 3);
  const promedioFinal = (
    promedios.reduce((a, b) => a + b, 0) / promedios.length
  ).toFixed(1);

  return (
    <div
      id="boleta-imprimible"
      style={{ background: "#fff", fontFamily: "var(--font-ibm-plex-sans), sans-serif" }}
      className="p-8"
    >
      <div
        style={{ borderBottom: `2px solid ${C.ink}` }}
        className="flex items-start justify-between gap-4 pb-4 mb-5"
      >
        <div className="flex items-start gap-2">
          <GraduationCap size={24} color={C.ink} className="shrink-0 mt-0.5" />
          <div>
            <p
              style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }}
              className="font-semibold leading-tight"
            >
              {ESCUELA.nombreCompleto}
            </p>
            <p style={{ color: C.inkSoft }} className="text-xs">
              {ESCUELA.tipo} · Ciclo escolar {ESCUELA.ciclo}
            </p>
          </div>
        </div>
        <p
          style={{ color: C.ink, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
          className="text-xs shrink-0"
        >
          Boleta oficial · 3er periodo
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5 text-sm">
        <p style={{ color: C.ink }}>
          <span style={{ color: C.inkSoft }}>Alumno(a): </span>
          {hijo.nombre}
        </p>
        <p style={{ color: C.ink }}>
          <span style={{ color: C.inkSoft }}>Grupo: </span>
          {hijo.grupo}
        </p>
        <p style={{ color: C.ink }}>
          <span style={{ color: C.inkSoft }}>Asesor(a): </span>
          {hijo.asesor}
        </p>
        <p style={{ color: C.ink }}>
          <span style={{ color: C.inkSoft }}>Fecha de emisión: </span>
          07/jul/2026
        </p>
      </div>

      <table className="w-full text-sm mb-6">
        <thead>
          <tr style={{ borderBottom: `1.5px solid ${C.ink}`, color: C.inkSoft }} className="text-left">
            <th className="py-1.5">Materia</th>
            <th className="py-1.5 text-center">P1</th>
            <th className="py-1.5 text-center">P2</th>
            <th className="py-1.5 text-center">P3</th>
            <th className="py-1.5 text-center">Promedio</th>
          </tr>
        </thead>
        <tbody>
          {hijo.materias.map((m, i) => (
            <tr key={m.materia} style={{ borderBottom: `1px solid ${C.line}` }}>
              <td style={{ color: C.ink }} className="py-1.5">
                {m.materia}
              </td>
              <td
                className="py-1.5 text-center"
                style={{ color: C.inkSoft, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
              >
                {m.p1.toFixed(1)}
              </td>
              <td
                className="py-1.5 text-center"
                style={{ color: C.inkSoft, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
              >
                {m.p2.toFixed(1)}
              </td>
              <td
                className="py-1.5 text-center"
                style={{ color: C.inkSoft, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
              >
                {m.p3.toFixed(1)}
              </td>
              <td
                className="py-1.5 text-center font-semibold"
                style={{
                  color: promedios[i] >= 6 ? C.green : C.red,
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                }}
              >
                {promedios[i].toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-10">
        <div style={{ border: `1.5px solid ${C.ink}` }} className="rounded-md px-4 py-2 text-right">
          <p style={{ color: C.inkSoft }} className="text-xs">
            Promedio general
          </p>
          <p
            style={{ color: C.ink, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            className="text-xl font-semibold"
          >
            {promedioFinal}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 text-center text-xs" style={{ color: C.inkSoft }}>
        <div>
          <div style={{ borderTop: `1px solid ${C.ink}` }} className="pt-1">
            Director(a)
          </div>
        </div>
        <div>
          <div style={{ borderTop: `1px solid ${C.ink}` }} className="pt-1">
            Asesor(a)
          </div>
        </div>
        <div>
          <div style={{ borderTop: `1px solid ${C.ink}` }} className="pt-1">
            Padre / Tutor
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoletaModal({
  hijo,
  onClose,
}: {
  hijo: Alumno;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="no-imprimir fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(22,35,63,0.55)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", maxHeight: "90vh" }}
        className="w-full max-w-xl overflow-y-auto rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="no-imprimir flex items-center justify-between px-5 py-3 sticky top-0"
          style={{ background: C.ink, color: "#fff" }}
        >
          <span className="text-sm font-medium">Vista previa de boleta</span>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 text-sm">
              <Printer size={15} /> Descargar / imprimir
            </button>
            <button onClick={onClose} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
        </div>
        <BoletaDocumento hijo={hijo} />
      </div>
    </div>
  );
}
