"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RoleGuard from "@/app/components/RoleGuard";
import { CalifPill, CalendarioMensual } from "@/app/components/ui";
import { useApp } from "@/app/providers/AppProvider";
import { bandaPct, matrizDelMes, pctAsistenciaGrupo } from "@/lib/attendance";
import { GRUPOS_ADMIN, HOY, NOMBRE_MES, PROMEDIO_POR_GRADO } from "@/lib/mock-data";
import { C, ESCUELA } from "@/lib/theme";

function ComparativaMaterias() {
  const [grado, setGrado] = useState("1°");
  const data = PROMEDIO_POR_GRADO[grado];
  const grupos = Object.keys(data[0]).filter((k) => k !== "materia");
  const colores = [C.ink, C.gold, C.red];

  return (
    <div
      style={{ background: C.card, border: `1px solid ${C.line}` }}
      className="rounded-lg p-4 mt-3"
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} color={C.ink} />
          <span
            style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }}
            className="font-semibold"
          >
            Comparativa de promedios por materia
          </span>
        </div>
        <div className="flex gap-1">
          {Object.keys(PROMEDIO_POR_GRADO).map((g) => (
            <button
              key={g}
              onClick={() => setGrado(g)}
              style={{
                background: grado === g ? C.ink : "#fff",
                color: grado === g ? "#fff" : C.ink,
                border: `1px solid ${C.ink}`,
              }}
              className="rounded-full px-3 py-1 text-xs font-medium"
            >
              {g} grado
            </button>
          ))}
        </div>
      </div>
      <p style={{ color: C.inkSoft }} className="text-xs mb-3">
        Promedio del tercer periodo por grupo, {grado} grado
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={C.line} vertical={false} />
          <XAxis
            dataKey="materia"
            tick={{ fill: C.inkSoft, fontSize: 11 }}
            axisLine={{ stroke: C.line }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fill: C.inkSoft, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              fontFamily: "var(--font-ibm-plex-sans), sans-serif",
              fontSize: 12,
              borderColor: C.line,
            }}
            cursor={{ fill: C.paper }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              fontFamily: "var(--font-ibm-plex-sans), sans-serif",
            }}
          />
          {grupos.map((g, i) => (
            <Bar key={g} dataKey={g} fill={colores[i % colores.length]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function AsistenciaGeneralAdmin() {
  const [grupo, setGrupo] = useState(GRUPOS_ADMIN[0].grupo);
  const semanas = matrizDelMes(2026, 6);
  const diasHabiles = semanas.flat().filter((d): d is number => {
    if (d == null) return false;
    const fecha = new Date(2026, 6, d);
    const ds = fecha.getDay();
    return ds !== 0 && ds !== 6 && fecha <= HOY;
  });
  const promedioMes = diasHabiles.length
    ? Math.round(
        diasHabiles.reduce((s, d) => s + pctAsistenciaGrupo(grupo, d), 0) /
          diasHabiles.length
      )
    : 0;

  return (
    <div
      style={{ background: C.card, border: `1px solid ${C.line}` }}
      className="rounded-lg p-4 mt-3"
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={16} color={C.ink} />
          <span
            style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }}
            className="font-semibold"
          >
            Asistencia general por grupo
          </span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {GRUPOS_ADMIN.map((g) => (
            <button
              key={g.grupo}
              onClick={() => setGrupo(g.grupo)}
              style={{
                background: grupo === g.grupo ? C.ink : "#fff",
                color: grupo === g.grupo ? "#fff" : C.ink,
                border: `1px solid ${C.ink}`,
              }}
              className="rounded-full px-3 py-1 text-xs font-medium"
            >
              {g.grupo}
            </button>
          ))}
        </div>
      </div>

      <p style={{ color: C.inkSoft }} className="text-xs mb-3">
        Promedio de asistencia del grupo {grupo} en {NOMBRE_MES}:{" "}
        <span
          style={{
            color: C.ink,
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontWeight: 600,
          }}
        >
          {promedioMes}%
        </span>
      </p>

      <CalendarioMensual
        titulo={`Grupo ${grupo}`}
        semanas={semanas}
        leyenda={[
          { color: C.green, label: "≥97% asistencia" },
          { color: C.gold, label: "93–96%" },
          { color: C.red, label: "<93%" },
        ]}
        renderCelda={(dia) => {
          const fecha = new Date(2026, 6, dia);
          const ds = fecha.getDay();
          if (ds === 0 || ds === 6) {
            return (
              <div
                className="w-full h-full rounded-md flex items-center justify-center text-[11px]"
                style={{ color: C.inkSoft }}
              >
                {dia}
              </div>
            );
          }
          if (fecha > HOY) {
            return (
              <div
                style={{ background: C.paper }}
                className="w-full h-full rounded-md flex items-center justify-center text-[11px]"
              >
                {dia}
              </div>
            );
          }
          const pct = pctAsistenciaGrupo(grupo, dia);
          const banda = bandaPct(pct);
          return (
            <div
              style={{
                background: banda.bg,
                color: banda.color,
                border: `1px solid ${banda.color}`,
              }}
              className="w-full h-full rounded-md flex items-center justify-center text-[11px] font-medium"
              title={`${pct}% de asistencia`}
            >
              {dia}
            </div>
          );
        }}
      />
    </div>
  );
}

function DireccionContent() {
  const { logout } = useApp();
  const router = useRouter();
  const totalAlumnos = GRUPOS_ADMIN.reduce((s, g) => s + g.alumnos, 0);
  const promedioGeneral = (
    GRUPOS_ADMIN.reduce((s, g) => s + g.promedio, 0) / GRUPOS_ADMIN.length
  ).toFixed(1);

  return (
    <div style={{ background: C.paper, minHeight: "100vh" }} className="pb-12">
      <div
        style={{ background: C.gold }}
        className="px-6 py-5 flex items-center justify-between text-white gap-4"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck size={22} className="shrink-0" />
          <span
            style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600 }}
            className="text-base sm:text-lg leading-snug"
          >
            Dirección — {ESCUELA.etiqueta}
          </span>
        </div>
        <button
          onClick={() => void logout().then(() => router.push("/login"))}
          className="flex items-center gap-1 text-sm shrink-0"
        >
          <LogOut size={16} /> Salir
        </button>
      </div>

      <div className="px-6 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
          <p style={{ color: C.inkSoft }} className="text-xs mb-1">
            Alumnos inscritos
          </p>
          <p
            style={{ color: C.ink, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            className="text-2xl font-semibold"
          >
            {totalAlumnos}
          </p>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
          <p style={{ color: C.inkSoft }} className="text-xs mb-1">
            Promedio general
          </p>
          <p
            style={{ color: C.ink, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            className="text-2xl font-semibold"
          >
            {promedioGeneral}
          </p>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
          <p style={{ color: C.inkSoft }} className="text-xs mb-1">
            Grupos activos
          </p>
          <p
            style={{ color: C.ink, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            className="text-2xl font-semibold"
          >
            {GRUPOS_ADMIN.length}
          </p>
        </div>
      </div>

      <div className="px-6 pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} color={C.ink} />
          <span
            style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }}
            className="font-semibold"
          >
            Grupos y asesores
          </span>
        </div>
        <div
          style={{ background: C.card, border: `1px solid ${C.line}` }}
          className="overflow-x-auto rounded-lg"
        >
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr style={{ background: C.paper, color: C.inkSoft }} className="text-left">
                <th className="py-2 px-3 font-medium">Grupo</th>
                <th className="py-2 px-3 font-medium">Asesor(a)</th>
                <th className="py-2 px-3 font-medium text-center">Alumnos</th>
                <th className="py-2 px-3 font-medium text-center">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {GRUPOS_ADMIN.map((g) => (
                <tr key={g.grupo} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td
                    style={{ color: C.ink, fontFamily: "var(--font-ibm-plex-mono), monospace" }}
                    className="py-2 px-3 font-medium"
                  >
                    {g.grupo}
                  </td>
                  <td style={{ color: C.ink }} className="py-2 px-3">
                    <span className="inline-flex items-center gap-2">
                      <BookOpen size={14} color={C.inkSoft} /> {g.asesor}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center" style={{ color: C.inkSoft }}>
                    {g.alumnos}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <CalifPill valor={g.promedio} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ComparativaMaterias />
        <AsistenciaGeneralAdmin />
      </div>
    </div>
  );
}

export default function DireccionPage() {
  return (
    <RoleGuard allow={["direccion"]}>
      <DireccionContent />
    </RoleGuard>
  );
}
