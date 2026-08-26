"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  FileDown,
  GraduationCap,
  LogOut,
  MessageCircle,
} from "lucide-react";
import RoleGuard from "@/app/components/RoleGuard";
import { CalifPill } from "@/app/components/ui";
import {
  AgendaCard,
  AsistenciaCard,
  AvisosCard,
  ReportesConductaCard,
} from "@/app/components/PortalCards";
import BoletaModal from "@/app/components/BoletaModal";
import { useApp } from "@/app/providers/AppProvider";
import { C, ESCUELA } from "@/lib/theme";

function PadreContent() {
  const { user, hijos, logout } = useApp();
  const router = useRouter();
  const [hijoId, setHijoId] = useState(hijos[0]?.id ?? "h1");
  const [showBoleta, setShowBoleta] = useState(false);
  const hijo = hijos.find((h) => h.id === hijoId) ?? hijos[0];
  if (!hijo) {
    return (
      <div style={{ background: C.paper, minHeight: "100vh" }} className="p-6 text-sm">
        No hay alumnos vinculados.
      </div>
    );
  }
  const promedio = (
    hijo.materias.reduce((s, m) => s + (m.p1 + m.p2 + m.p3) / 3, 0) /
    hijo.materias.length
  ).toFixed(1);

  return (
    <div style={{ background: C.paper, minHeight: "100vh" }} className="pb-16">
      <div
        style={{ background: C.ink }}
        className="px-6 py-5 flex items-center justify-between text-white gap-4"
      >
        <div className="flex items-center gap-2 min-w-0">
          <GraduationCap size={22} className="shrink-0" />
          <span
            style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600 }}
            className="text-base sm:text-lg leading-snug truncate"
          >
            {ESCUELA.etiqueta}
          </span>
        </div>
        <button
          onClick={() => void logout().then(() => router.push("/login"))}
          className="flex items-center gap-2 text-sm opacity-80 shrink-0"
        >
          <span>{user?.name}</span>
          <LogOut size={16} />
        </button>
      </div>

      <div className="px-6 pt-5 flex gap-2">
        {hijos.map((h) => (
          <button
            key={h.id}
            onClick={() => setHijoId(h.id)}
            style={{
              background: h.id === hijoId ? C.ink : "#fff",
              color: h.id === hijoId ? "#fff" : C.ink,
              border: `1px solid ${C.ink}`,
            }}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition"
          >
            {h.nombre.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="px-6 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          style={{ background: C.card, border: `1px solid ${C.line}` }}
          className="rounded-lg p-4 sm:col-span-2"
        >
          <p style={{ color: C.inkSoft }} className="text-xs mb-1">
            {hijo.grupo} · Asesor(a)
          </p>
          <p
            style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }}
            className="font-semibold text-lg"
          >
            {hijo.nombre}
          </p>
          <p style={{ color: C.inkSoft }} className="text-sm">
            {hijo.asesor}
          </p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <button
              onClick={() => router.push(`/chat?hijo=${hijo.id}`)}
              style={{ color: C.ink, border: `1px solid ${C.ink}` }}
              className="rounded-md px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:bg-white"
            >
              <MessageCircle size={14} /> Enviar mensaje al asesor
            </button>
            <button
              onClick={() => setShowBoleta(true)}
              style={{ color: "#fff", background: C.ink }}
              className="rounded-md px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:opacity-90"
            >
              <FileDown size={14} /> Descargar boleta
            </button>
          </div>
        </div>
        <div
          style={{ background: C.goldSoft, border: `1px solid ${C.gold}` }}
          className="rounded-lg p-4 flex flex-col justify-center items-center"
        >
          <p style={{ color: C.gold }} className="text-xs mb-1">
            Promedio actual
          </p>
          <p
            style={{ color: C.ink, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            className="text-2xl font-semibold"
          >
            {promedio}
          </p>
        </div>
      </div>

      <div className="px-6 pt-5">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList size={16} color={C.ink} />
          <span
            style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }}
            className="font-semibold"
          >
            Calificaciones
          </span>
        </div>
        <div
          style={{ background: C.card, border: `1px solid ${C.line}` }}
          className="overflow-x-auto rounded-lg"
        >
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr style={{ background: C.paper, color: C.inkSoft }} className="text-left">
                <th className="py-2 px-3 font-medium">Materia</th>
                <th className="py-2 px-3 font-medium text-center">P1</th>
                <th className="py-2 px-3 font-medium text-center">P2</th>
                <th className="py-2 px-3 font-medium text-center">P3</th>
              </tr>
            </thead>
            <tbody>
              {hijo.materias.map((m) => (
                <tr key={m.materia} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ color: C.ink }} className="py-2 px-3">
                    {m.materia}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <CalifPill valor={m.p1} />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <CalifPill valor={m.p2} />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <CalifPill valor={m.p3} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-6 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AvisosCard />
        <AgendaCard />
      </div>

      <div className="px-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReportesConductaCard hijoId={hijoId} />
        <AsistenciaCard hijoId={hijoId} />
      </div>

      {showBoleta && <BoletaModal hijo={hijo} onClose={() => setShowBoleta(false)} />}
    </div>
  );
}

export default function PadrePage() {
  return (
    <RoleGuard allow={["padre"]}>
      <PadreContent />
    </RoleGuard>
  );
}
