"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ALUMNOS_2B,
  ASISTENCIA_DETALLE,
  AVISOS,
  CHATS_INICIALES,
  DEMO_FECHA_ISO,
  EVENTOS_AGENDA,
  GRUPO_ASESOR,
  HIJOS,
  REPORTES_CONDUCTA,
} from "@/lib/mock-data";
import { listaDesdeDetalle, parseISOFecha } from "@/lib/attendance";
import { DEMO_CLAVE_ALUMNO } from "@/lib/theme";
import type {
  Alumno,
  AlumnoGrupo,
  AsistenciaDetalle,
  Aviso,
  ChatsPorAlumno,
  EventoAgenda,
  ListaAsistenciaDia,
  MensajeChat,
  ReporteConducta,
  Role,
  User,
} from "@/lib/types";
import { HOME_BY_ROLE, STORAGE_KEYS } from "@/lib/types";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { fetchProfile } from "@/lib/supabase/profiles";
import { fetchAlumnosByTutor } from "@/lib/supabase/alumnos";
import { fetchAvisos } from "@/lib/supabase/avisos";
import { fetchEventosAgenda } from "@/lib/supabase/eventos";
import { fetchMensajesChat, saveMensajeChat } from "@/lib/supabase/chat";
import { fetchReportesConducta } from "@/lib/supabase/conducta";
import {
  fetchAsistenciaDetalle,
  fetchListaAsistencia,
  saveListaAsistencia,
} from "@/lib/supabase/asistencias";

type ListasPorDia = Record<string, ListaAsistenciaDia>;

type AppContextType = {
  user: User | null;
  isInitializing: boolean;
  hijos: Alumno[];
  /** Roster de prueba del asesor (grupo 2°B); reemplazable luego por Supabase */
  alumnosGrupo: AlumnoGrupo[];
  avisos: Aviso[];
  eventos: EventoAgenda[];
  chats: ChatsPorAlumno;
  reportes: Record<string, ReporteConducta[]>;
  /** Fecha ISO de la lista que se está editando */
  fechaAsistencia: string;
  listaHoy: ListaAsistenciaDia;
  /** Fechas ISO con lista ya guardada */
  diasListaGuardados: string[];
  asistenciaDetalle: AsistenciaDetalle;
  hasSupabase: boolean;
  setUser: (user: User | null) => void;
  loginDemoPadre: (clave?: string) => boolean;
  loginDemoRole: (role: Exclude<Role, "padre">) => void;
  loginWithPassword: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string; role?: Role }>;
  logout: () => Promise<void>;
  sendChatMessage: (alumnoId: string, texto: string) => void;
  setFechaAsistencia: (fecha: string) => Promise<void>;
  setAsistenciaAlumno: (
    alumnoId: string,
    estado: ListaAsistenciaDia[string]
  ) => void;
  guardarListaAsistencia: () => Promise<boolean>;
  homeForRole: (role: Role) => string;
  homeForUser: string | null;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function isLocalDemoUser(u: User | null): boolean {
  return !!u?.id.startsWith("local-");
}

const defaultLista = (): ListaAsistenciaDia =>
  Object.fromEntries(ALUMNOS_2B.map((a) => [a.id, "presente" as const]));

const alumnoIds = () => ALUMNOS_2B.map((a) => a.id);

function horaActual(): string {
  return new Date().toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function normalizarLista(lista: ListaAsistenciaDia): ListaAsistenciaDia {
  const out: ListaAsistenciaDia = {};
  for (const [id, estado] of Object.entries(lista)) {
    out[id] = estado === "falta" || estado === "retardo" ? "falta" : "presente";
  }
  return out;
}

function mergeDetalleConLista(
  detalle: AsistenciaDetalle,
  fechaIso: string,
  lista: ListaAsistenciaDia
): AsistenciaDetalle {
  const dia = parseISOFecha(fechaIso).getDate();
  const next: AsistenciaDetalle = { ...detalle };
  for (const [id, estado] of Object.entries(lista)) {
    next[id] = { ...(next[id] || {}), [dia]: estado };
  }
  return next;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hijos, setHijos] = useState<Alumno[]>(HIJOS);
  const [avisos, setAvisos] = useState<Aviso[]>(AVISOS);
  const [eventos, setEventos] = useState<EventoAgenda[]>(EVENTOS_AGENDA);
  const [chats, setChats] = useState<ChatsPorAlumno>(CHATS_INICIALES);
  const [reportes, setReportes] =
    useState<Record<string, ReporteConducta[]>>(REPORTES_CONDUCTA);
  const [fechaAsistencia, setFechaAsistenciaState] =
    useState<string>(DEMO_FECHA_ISO);
  const [listasPorDia, setListasPorDia] = useState<ListasPorDia>({});
  const [diasListaGuardados, setDiasListaGuardados] = useState<string[]>([]);
  const [listaHoy, setListaHoy] = useState<ListaAsistenciaDia>(defaultLista);
  const [asistenciaDetalle, setAsistenciaDetalle] =
    useState<AsistenciaDetalle>(ASISTENCIA_DETALLE);
  const hasSupabase = isSupabaseConfigured();

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) writeJson(STORAGE_KEYS.session, u);
    else {
      try {
        localStorage.removeItem(STORAGE_KEYS.session);
      } catch {
        // ignore
      }
    }
  }, []);

  const loadDemoData = useCallback(() => {
    setHijos(HIJOS);
    setAvisos(AVISOS);
    setEventos(EVENTOS_AGENDA);
    setReportes(REPORTES_CONDUCTA);
    const savedDetalle = readJson<AsistenciaDetalle | null>(
      STORAGE_KEYS.asistenciaDetalle,
      null
    );
    const detalle =
      savedDetalle && Object.keys(savedDetalle).length
        ? savedDetalle
        : ASISTENCIA_DETALLE;
    setAsistenciaDetalle(detalle);
    const savedChats = readJson<ChatsPorAlumno | null>(STORAGE_KEYS.chat, null);
    setChats(savedChats && Object.keys(savedChats).length ? savedChats : CHATS_INICIALES);

    const porDia = readJson<ListasPorDia>(STORAGE_KEYS.asistenciaPorDia, {});
    const legacy = readJson<ListaAsistenciaDia | null>(STORAGE_KEYS.asistencia, null);
    if (legacy && Object.keys(legacy).length && !porDia[DEMO_FECHA_ISO]) {
      porDia[DEMO_FECHA_ISO] = legacy;
    }
    const cerradas = readJson<string[]>(STORAGE_KEYS.asistenciaCerradas, []);
    // Migrar clave antigua de cierre
    try {
      if (localStorage.getItem("gab_asist_lista_cerrada") === DEMO_FECHA_ISO) {
        if (!cerradas.includes(DEMO_FECHA_ISO)) cerradas.push(DEMO_FECHA_ISO);
      }
    } catch {
      // ignore
    }

    setListasPorDia(porDia);
    setDiasListaGuardados(cerradas);
    setFechaAsistenciaState(DEMO_FECHA_ISO);
    const listaInicial =
      porDia[DEMO_FECHA_ISO] ||
      listaDesdeDetalle(alumnoIds(), detalle, parseISOFecha(DEMO_FECHA_ISO).getDate());
    setListaHoy({ ...defaultLista(), ...listaInicial });
  }, []);

  const loadSupabaseData = useCallback(async (u: User) => {
    try {
      if (u.role === "padre") {
        const alumnos = await fetchAlumnosByTutor(u.id);
        setHijos(alumnos);
        if (alumnos.length) {
          const ids = alumnos.map((a) => a.id);
          const remoteChats = await fetchMensajesChat(ids);
          setChats(Object.keys(remoteChats).length ? remoteChats : {});
          const nextReportes: Record<string, ReporteConducta[]> = {};
          for (const a of alumnos) {
            nextReportes[a.id] = await fetchReportesConducta(a.id);
          }
          setReportes(nextReportes);
          const detalle = await fetchAsistenciaDetalle(ids, 2026, 6);
          if (Object.keys(detalle).length) {
            setAsistenciaDetalle((prev) => ({ ...ASISTENCIA_DETALLE, ...prev, ...detalle }));
          }
        } else {
          setChats({});
          setReportes({});
        }
      }

      const remoteAvisos = await fetchAvisos();
      setAvisos(remoteAvisos);
      const remoteEventos = await fetchEventosAgenda();
      setEventos(remoteEventos);

      if (u.role === "asesor") {
        const idsGrupo = ALUMNOS_2B.map((a) => a.id);
        const remoteChats = await fetchMensajesChat(idsGrupo);
        setChats(
          Object.keys(remoteChats).length
            ? { ...CHATS_INICIALES, ...remoteChats }
            : CHATS_INICIALES
        );

        const lista = await fetchListaAsistencia(GRUPO_ASESOR, DEMO_FECHA_ISO);
        setFechaAsistenciaState(DEMO_FECHA_ISO);
        if (Object.keys(lista).length) {
          const merged = { ...defaultLista(), ...lista };
          setListaHoy(merged);
          setListasPorDia((prev) => ({ ...prev, [DEMO_FECHA_ISO]: merged }));
          setDiasListaGuardados((prev) =>
            prev.includes(DEMO_FECHA_ISO) ? prev : [...prev, DEMO_FECHA_ISO]
          );
          setAsistenciaDetalle((prev) =>
            mergeDetalleConLista(prev, DEMO_FECHA_ISO, merged)
          );
        } else {
          setListaHoy(defaultLista());
        }
      }
    } catch (e) {
      console.warn("[AppProvider] error cargando Supabase", e);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const saved = readJson<User | null>(STORAGE_KEYS.session, null);

      if (hasSupabase && supabase) {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user;
        if (sessionUser && !cancelled) {
          const profile = await fetchProfile(sessionUser.id);
          if (profile) {
            setUser(profile);
            await loadSupabaseData(profile);
            if (!cancelled) setIsInitializing(false);
            return;
          }
        }
      }

      if (!cancelled) {
        if (saved && isLocalDemoUser(saved)) {
          setUserState(saved);
          loadDemoData();
        } else if (saved && !hasSupabase) {
          setUserState(saved);
          loadDemoData();
        } else {
          loadDemoData();
        }
        setIsInitializing(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [hasSupabase, loadDemoData, loadSupabaseData, setUser]);

  useEffect(() => {
    if (isLocalDemoUser(user) || !hasSupabase) {
      writeJson(STORAGE_KEYS.chat, chats);
    }
  }, [chats, hasSupabase, user]);

  useEffect(() => {
    if (isLocalDemoUser(user) || !hasSupabase) {
      writeJson(STORAGE_KEYS.asistenciaPorDia, listasPorDia);
      writeJson(STORAGE_KEYS.asistenciaCerradas, diasListaGuardados);
      writeJson(STORAGE_KEYS.asistencia, listaHoy);
    }
  }, [diasListaGuardados, hasSupabase, listaHoy, listasPorDia, user]);

  const setFechaAsistencia = useCallback(
    async (fecha: string) => {
      setFechaAsistenciaState(fecha);

      const cached = listasPorDia[fecha];
      if (cached && Object.keys(cached).length) {
        setListaHoy({ ...defaultLista(), ...cached });
        return;
      }

      if (hasSupabase && user && !isLocalDemoUser(user)) {
        const remota = await fetchListaAsistencia(GRUPO_ASESOR, fecha);
        if (Object.keys(remota).length) {
          const merged = { ...defaultLista(), ...remota };
          setListaHoy(merged);
          setListasPorDia((prev) => ({ ...prev, [fecha]: merged }));
          setDiasListaGuardados((prev) =>
            prev.includes(fecha) ? prev : [...prev, fecha]
          );
          setAsistenciaDetalle((prev) => mergeDetalleConLista(prev, fecha, merged));
          return;
        }
      }

      const dia = parseISOFecha(fecha).getDate();
      const desdeDetalle = listaDesdeDetalle(alumnoIds(), asistenciaDetalle, dia);
      setListaHoy({ ...defaultLista(), ...desdeDetalle });
    },
    [asistenciaDetalle, hasSupabase, listasPorDia, user]
  );

  const loginDemoPadre = useCallback(
    (clave?: string) => {
      const value = (clave ?? "").trim().toUpperCase();
      if (value !== DEMO_CLAVE_ALUMNO) return false;
      loadDemoData();
      setUser({
        id: "local-padre",
        name: "Familia Domínguez",
        role: "padre",
        alumnoClave: DEMO_CLAVE_ALUMNO,
      });
      return true;
    },
    [loadDemoData, setUser]
  );

  const loginDemoRole = useCallback(
    (role: Exclude<Role, "padre">) => {
      loadDemoData();
      setUser(
        role === "asesor"
          ? {
              id: "local-asesor",
              name: "Profa. Karla Reyes",
              role: "asesor",
              email: "asesor@demo.local",
            }
          : {
              id: "local-direccion",
              name: "Dirección escolar",
              role: "direccion",
              email: "direccion@demo.local",
            }
      );
    },
    [loadDemoData, setUser]
  );

  const loginWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!hasSupabase || !supabase) {
        return { ok: false, error: "Supabase no configurado. Usa el acceso demo." };
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error || !data.user) {
        return { ok: false, error: "Usuario o contraseña incorrectos." };
      }
      const profile = await fetchProfile(data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        return {
          ok: false,
          error: "Tu cuenta no tiene perfil asignado. Contacta a dirección.",
        };
      }
      setUser(profile);
      await loadSupabaseData(profile);
      return { ok: true, role: profile.role };
    },
    [hasSupabase, loadSupabaseData, setUser]
  );

  const logout = useCallback(async () => {
    setUser(null);
    loadDemoData();
    if (hasSupabase && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // demo local
      }
    }
  }, [hasSupabase, loadDemoData, setUser]);

  const sendChatMessage = useCallback(
    (alumnoId: string, texto: string) => {
      const trimmed = texto.trim();
      if (!trimmed) return;
      const mensaje: MensajeChat = {
        de: user?.role === "asesor" ? "asesor" : "padre",
        texto: trimmed,
        hora: horaActual(),
      };
      setChats((prev) => ({
        ...prev,
        [alumnoId]: [...(prev[alumnoId] || []), mensaje],
      }));
      if (hasSupabase && !isLocalDemoUser(user)) {
        void saveMensajeChat(alumnoId, mensaje);
      }
    },
    [hasSupabase, user]
  );

  const setAsistenciaAlumno = useCallback(
    (alumnoId: string, estado: ListaAsistenciaDia[string]) => {
      setListaHoy((prev) => {
        const next = { ...prev, [alumnoId]: estado };
        setListasPorDia((porDia) => ({
          ...porDia,
          [fechaAsistencia]: next,
        }));
        return next;
      });
    },
    [fechaAsistencia]
  );

  const guardarListaAsistencia = useCallback(async () => {
    const listaNormalizada = normalizarLista(listaHoy);
    // Completar alumnos que falten en la lista
    const completa = { ...defaultLista(), ...listaNormalizada };
    setListaHoy(completa);
    setListasPorDia((prev) => {
      const next = { ...prev, [fechaAsistencia]: completa };
      writeJson(STORAGE_KEYS.asistenciaPorDia, next);
      return next;
    });
    setDiasListaGuardados((prev) => {
      const next = prev.includes(fechaAsistencia)
        ? prev
        : [...prev, fechaAsistencia];
      writeJson(STORAGE_KEYS.asistenciaCerradas, next);
      return next;
    });

    const nextDetalle = mergeDetalleConLista(
      asistenciaDetalle,
      fechaAsistencia,
      completa
    );
    setAsistenciaDetalle(nextDetalle);
    writeJson(STORAGE_KEYS.asistencia, completa);
    writeJson(STORAGE_KEYS.asistenciaDetalle, nextDetalle);

    if (hasSupabase && !isLocalDemoUser(user)) {
      return saveListaAsistencia(GRUPO_ASESOR, fechaAsistencia, completa);
    }
    return true;
  }, [asistenciaDetalle, fechaAsistencia, hasSupabase, listaHoy, user]);

  const homeForRole = useCallback((role: Role) => HOME_BY_ROLE[role], []);
  const homeForUser = useMemo(
    () => (user ? HOME_BY_ROLE[user.role] : null),
    [user]
  );

  const value = useMemo<AppContextType>(
    () => ({
      user,
      isInitializing,
      hijos,
      alumnosGrupo: ALUMNOS_2B,
      avisos,
      eventos,
      chats,
      reportes,
      fechaAsistencia,
      listaHoy,
      diasListaGuardados,
      asistenciaDetalle,
      hasSupabase,
      setUser,
      loginDemoPadre,
      loginDemoRole,
      loginWithPassword,
      logout,
      sendChatMessage,
      setFechaAsistencia,
      setAsistenciaAlumno,
      guardarListaAsistencia,
      homeForRole,
      homeForUser,
    }),
    [
      user,
      isInitializing,
      hijos,
      avisos,
      eventos,
      chats,
      reportes,
      fechaAsistencia,
      listaHoy,
      diasListaGuardados,
      asistenciaDetalle,
      hasSupabase,
      setUser,
      loginDemoPadre,
      loginDemoRole,
      loginWithPassword,
      logout,
      sendChatMessage,
      setFechaAsistencia,
      setAsistenciaAlumno,
      guardarListaAsistencia,
      homeForRole,
      homeForUser,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
