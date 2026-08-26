"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  LogOut,
  MessageCircle,
  XCircle,
} from "lucide-react";
import RoleGuard from "@/app/components/RoleGuard";
import { CalifPill } from "@/app/components/ui";
import { useApp } from "@/app/providers/AppProvider";
import { diasHabilesHastaHoy, parseISOFecha } from "@/lib/attendance";
import {
  CALIFS_PRUEBA_2B,
  GRUPO_ASESOR,
  HIJOS,
  HOY,
} from "@/lib/mock-data";
import { C } from "@/lib/theme";

type MarcaAsistencia = "presente" | "falta";

const MARCAS = {
  presente: { icon: CheckCircle2, color: C.green, bg: C.greenSoft, label: "Asistió" },
  falta: { icon: XCircle, color: C.red, bg: C.redSoft, label: "Falta" },
} as const;

function norma(estado?: string): MarcaAsistencia {
  return estado === "falta" || estado === "retardo" ? "falta" : "presente";
}

function Panel({
  title,
  icon,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      style={{ background: C.card, border: `1px solid ${C.line}` }}
      className={`flex min-h-0 flex-col rounded-xl ${className}`}
    >
      <header
        style={{ borderBottom: `1px solid ${C.line}` }}
        className="flex items-start gap-2 px-4 py-3"
      >
        <span style={{ color: C.ink }} className="mt-0.5 shrink-0">
          {icon}
        </span>
        <div className="min-w-0">
          <h2
            style={{ color: C.ink, fontFamily: "var(--font-fraunces), serif" }}
            className="text-base font-semibold"
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ color: C.inkSoft }} className="text-xs">
              {subtitle}
            </p>
          )}
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col p-4">{children}</div>
    </section>
  );
}

function AsesorContent() {
  const {
    user,
    alumnosGrupo,
    fechaAsistencia,
    listaHoy,
    diasListaGuardados,
    chats,
    setFechaAsistencia,
    setAsistenciaAlumno,
    guardarListaAsistencia,
    logout,
  } = useApp();
  const router = useRouter();
  const diasHabiles = useMemo(() => diasHabilesHastaHoy(), []);
  const diaGuardado = diasListaGuardados.includes(fechaAsistencia);
  const [listaVisible, setListaVisible] = useState(!diaGuardado);
  const [cambiandoDia, setCambiandoDia] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);
  const [alumnoCalifId, setAlumnoCalifId] = useState(CALIFS_PRUEBA_2B[0]?.id ?? "h1");

  useEffect(() => {
    setListaVisible(!diasListaGuardados.includes(fechaAsistencia));
    setErrorGuardar(null);
  }, [fechaAsistencia, diasListaGuardados]);

  const marcar = (id: string, estado: MarcaAsistencia) => {
    setAsistenciaAlumno(id, estado);
    setErrorGuardar(null);
  };

  const conteo = alumnosGrupo.reduce(
    (acc, a) => {
      const e = norma(listaHoy[a.id]);
      acc[e] += 1;
      return acc;
    },
    { presente: 0, falta: 0 }
  );

  const cambiarDia = async (iso: string) => {
    if (iso === fechaAsistencia) return;
    setCambiandoDia(true);
    await setFechaAsistencia(iso);
    setCambiandoDia(false);
  };

  const guardar = async () => {
    setGuardando(true);
    setErrorGuardar(null);
    const ok = await guardarListaAsistencia();
    setGuardando(false);
    if (ok) setListaVisible(false);
    else setErrorGuardar("No se pudo guardar. Intenta de nuevo.");
  };

  const fechaLabel = parseISOFecha(fechaAsistencia).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const materiasDetalle = useMemo(() => {
    const mateo = HIJOS.find((h) => h.id === "h1");
    if (alumnoCalifId === "h1" && mateo) return mateo.materias;
    return null;
  }, [alumnoCalifId]);

  const promedioGrupo = (
    CALIFS_PRUEBA_2B.reduce((s, a) => s + a.promedio, 0) / CALIFS_PRUEBA_2B.length
  ).toFixed(1);

  return (
    <div style={{ background: C.paper, minHeight: "100vh" }} className="pb-10">
      <header
        style={{ background: C.ink }}
        className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-white sm:px-6"
      >
        <div className="min-w-0">
          <p
            style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600 }}
            className="text-lg"
          >
            Panel del asesor — {GRUPO_ASESOR}
          </p>
          <p className="text-xs opacity-75">
            {user?.name} ·{" "}
            {HOY.toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => void logout().then(() => router.push("/login"))}
          className="flex items-center gap-1.5 text-sm opacity-90 hover:opacity-100"
        >
          <LogOut size={16} /> Salir
        </button>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 pt-5 sm:px-6 lg:grid-cols-5">
        {/* ——— Asistencia ——— */}
        <Panel
          className="lg:col-span-3"
          title="Lista de asistencia"
          subtitle={`Una lista por día · ${fechaLabel}`}
          icon={<ClipboardCheck size={18} />}
        >
          <div className="mb-3">
            <p style={{ color: C.inkSoft }} className="mb-1.5 text-[11px]">
              Elige el día (pasa a otro día o abre uno guardado para justificar faltas)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {diasHabiles.map((d) => {
                const activo = d.iso === fechaAsistencia;
                const guardado = diasListaGuardados.includes(d.iso);
                return (
                  <button
                    key={d.iso}
                    type="button"
                    disabled={cambiandoDia}
                    onClick={() => void cambiarDia(d.iso)}
                    style={{
                      background: activo ? C.ink : guardado ? C.greenSoft : "#fff",
                      color: activo ? "#fff" : C.ink,
                      border: `1px solid ${activo ? C.ink : guardado ? C.green : C.line}`,
                    }}
                    className="rounded-md px-2.5 py-1.5 text-[11px] font-medium capitalize disabled:opacity-60"
                    title={guardado ? "Lista guardada" : "Sin guardar"}
                  >
                    {d.label}
                    {d.esHoy ? " · hoy" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <div
              style={{ background: C.greenSoft, border: `1px solid ${C.green}` }}
              className="rounded-lg py-2 text-center"
            >
              <p style={{ color: C.green }} className="text-[10px]">
                Asistieron
              </p>
              <p
                style={{ fontFamily: "var(--font-ibm-plex-mono), monospace", color: C.ink }}
                className="text-lg font-semibold"
              >
                {conteo.presente}
              </p>
            </div>
            <div
              style={{ background: C.redSoft, border: `1px solid ${C.red}` }}
              className="rounded-lg py-2 text-center"
            >
              <p style={{ color: C.red }} className="text-[10px]">
                Faltas
              </p>
              <p
                style={{ fontFamily: "var(--font-ibm-plex-mono), monospace", color: C.ink }}
                className="text-lg font-semibold"
              >
                {conteo.falta}
              </p>
            </div>
          </div>

          {listaVisible ? (
            <>
              {diaGuardado && (
                <p style={{ color: C.inkSoft }} className="mb-2 text-xs">
                  Editando lista guardada — puedes justificar faltas marcando «Asistió» y
                  volver a guardar.
                </p>
              )}
              <div
                style={{ border: `1px solid ${C.line}` }}
                className="max-h-[420px] overflow-y-auto rounded-lg"
              >
                {alumnosGrupo.map((a, i) => {
                  const actual = norma(listaHoy[a.id]);
                  return (
                    <div
                      key={a.id}
                      style={{ borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}
                      className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5"
                    >
                      <span style={{ color: C.ink }} className="text-sm font-medium">
                        <span style={{ color: C.inkSoft }} className="mr-2 text-xs">
                          {i + 1}.
                        </span>
                        {a.nombre}
                      </span>
                      <div className="flex gap-1">
                        {(["presente", "falta"] as MarcaAsistencia[]).map((estado) => {
                          const est = MARCAS[estado];
                          const Icon = est.icon;
                          const activo = actual === estado;
                          return (
                            <button
                              key={estado}
                              type="button"
                              onClick={() => marcar(a.id, estado)}
                              title={est.label}
                              style={{
                                background: activo ? est.bg : "#fff",
                                border: `1px solid ${activo ? est.color : C.line}`,
                                color: activo ? est.color : C.inkSoft,
                              }}
                              className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium"
                            >
                              <Icon size={12} />
                              {est.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void guardar()}
                  disabled={guardando}
                  style={{ background: C.ink }}
                  className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                >
                  {guardando
                    ? "Guardando…"
                    : diaGuardado
                      ? "Guardar cambios"
                      : "Guardar asistencias y faltas"}
                </button>
                {diaGuardado && (
                  <button
                    type="button"
                    onClick={() => setListaVisible(false)}
                    style={{
                      color: C.inkSoft,
                      border: `1px solid ${C.line}`,
                      background: "#fff",
                    }}
                    className="rounded-md px-3 py-2 text-xs font-medium"
                  >
                    Cerrar lista
                  </button>
                )}
                {errorGuardar && (
                  <span style={{ color: C.red }} className="text-xs">
                    {errorGuardar}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span style={{ color: C.green }} className="text-sm">
                ✓ Lista del día guardada
              </span>
              <button
                type="button"
                onClick={() => setListaVisible(true)}
                style={{
                  color: C.ink,
                  border: `1px solid ${C.line}`,
                  background: "#fff",
                }}
                className="rounded-md px-3 py-1.5 text-xs font-medium hover:opacity-90"
              >
                Abrir / editar lista
              </button>
            </div>
          )}
        </Panel>

        {/* ——— Chats ——— */}
        <Panel
          className="lg:col-span-2"
          title="Chats con familias"
          subtitle="Conversación 1:1 por alumno"
          icon={<MessageCircle size={18} />}
        >
          <div className="flex max-h-[480px] flex-col gap-2 overflow-y-auto">
            {alumnosGrupo.map((a) => {
              const mensajes = chats[a.id] || [];
              const ultimo = mensajes[mensajes.length - 1];
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => router.push(`/chat?hijo=${a.id}`)}
                  style={{ border: `1px solid ${C.line}`, background: C.paper }}
                  className="rounded-lg px-3 py-2.5 text-left transition hover:opacity-90"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p style={{ color: C.ink }} className="text-sm font-medium">
                      Familia de {a.nombre.split(" ")[0]}
                    </p>
                    {mensajes.length > 0 && (
                      <span
                        style={{
                          background: C.ink,
                          color: "#fff",
                          fontFamily: "var(--font-ibm-plex-mono), monospace",
                        }}
                        className="rounded-full px-1.5 py-0.5 text-[10px]"
                      >
                        {mensajes.length}
                      </span>
                    )}
                  </div>
                  <p style={{ color: C.inkSoft }} className="mt-0.5 truncate text-xs">
                    {ultimo
                      ? `${ultimo.de === "asesor" ? "Tú" : "Familia"}: ${ultimo.texto}`
                      : "Sin mensajes · abrir chat"}
                  </p>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => router.push("/chat")}
            style={{ border: `1px solid ${C.ink}`, color: C.ink }}
            className="mt-3 w-full rounded-md py-2 text-xs font-medium hover:bg-white"
          >
            Abrir bandeja de chats
          </button>
        </Panel>

        {/* ——— Calificaciones ——— */}
        <Panel
          className="lg:col-span-5"
          title="Calificaciones del grupo"
          subtitle={`Promedio del grupo (prueba): ${promedioGrupo} · datos de demostración`}
          icon={<ClipboardList size={18} />}
        >
          <div className="grid gap-4 lg:grid-cols-5">
            <div
              style={{ border: `1px solid ${C.line}` }}
              className="overflow-hidden rounded-lg lg:col-span-2"
            >
              <div
                style={{ background: C.paper, color: C.inkSoft }}
                className="px-3 py-2 text-xs font-medium"
              >
                Alumnos · promedio general
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {CALIFS_PRUEBA_2B.map((a, i) => {
                  const activo = a.id === alumnoCalifId;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAlumnoCalifId(a.id)}
                      style={{
                        borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
                        background: activo ? C.paper : "#fff",
                      }}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
                    >
                      <span style={{ color: C.ink }} className="text-sm">
                        {a.nombre}
                      </span>
                      <CalifPill valor={a.promedio} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{ border: `1px solid ${C.line}` }}
              className="overflow-x-auto rounded-lg lg:col-span-3"
            >
              <div
                style={{ background: C.paper, color: C.inkSoft }}
                className="px-3 py-2 text-xs font-medium"
              >
                Detalle por materia ·{" "}
                {CALIFS_PRUEBA_2B.find((a) => a.id === alumnoCalifId)?.nombre}
              </div>
              {materiasDetalle ? (
                <table className="w-full min-w-[360px] text-sm">
                  <thead>
                    <tr style={{ color: C.inkSoft }} className="text-left">
                      <th className="px-3 py-2 font-medium">Materia</th>
                      <th className="px-3 py-2 text-center font-medium">P1</th>
                      <th className="px-3 py-2 text-center font-medium">P2</th>
                      <th className="px-3 py-2 text-center font-medium">P3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materiasDetalle.map((m) => (
                      <tr key={m.materia} style={{ borderTop: `1px solid ${C.line}` }}>
                        <td style={{ color: C.ink }} className="px-3 py-2">
                          {m.materia}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <CalifPill valor={m.p1} />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <CalifPill valor={m.p2} />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <CalifPill valor={m.p3} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                  <p style={{ color: C.inkSoft }} className="text-sm">
                    Detalle por materia disponible para Mateo (datos de prueba).
                  </p>
                  <p style={{ color: C.inkSoft }} className="text-xs">
                    Promedio del alumno:{" "}
                    <CalifPill
                      valor={
                        CALIFS_PRUEBA_2B.find((a) => a.id === alumnoCalifId)?.promedio ?? 0
                      }
                    />
                  </p>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default function AsesorPage() {
  return (
    <RoleGuard allow="asesor">
      <AsesorContent />
    </RoleGuard>
  );
}
