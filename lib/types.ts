export type Role = "padre" | "asesor" | "direccion";

export type User = {
  id: string;
  name: string;
  role: Role;
  email?: string;
  alumnoClave?: string;
};

export type MateriaCalificacion = {
  materia: string;
  p1: number;
  p2: number;
  p3: number;
};

export type Alumno = {
  id: string;
  nombre: string;
  grupo: string;
  asesor: string;
  materias: MateriaCalificacion[];
};

export type MensajeChat = {
  de: "padre" | "asesor";
  texto: string;
  hora: string;
};

export type ChatsPorAlumno = Record<string, MensajeChat[]>;

export type TipoAviso = "urgente" | "evento" | "info";

export type Aviso = {
  tipo: TipoAviso;
  titulo: string;
  cuerpo: string;
  fecha: string;
};

export type EventoAgenda = {
  fecha: string;
  dia: string;
  titulo: string;
};

export type TipoConducta = "positivo" | "negativo";

export type ReporteConducta = {
  tipo: TipoConducta;
  fecha: string;
  titulo: string;
  detalle: string;
  reporta: string;
};

export type EstadoAsistencia = "presente" | "falta" | "retardo";

export type EstadoCalendario = EstadoAsistencia | "noclase" | "pendiente";

export type AsistenciaDetalle = Record<string, Record<number, EstadoAsistencia>>;

export type ListaAsistenciaDia = Record<string, EstadoAsistencia>;

export type AlumnoGrupo = {
  id: string;
  nombre: string;
};

export type GrupoAdmin = {
  grupo: string;
  asesor: string;
  alumnos: number;
  promedio: number;
};

export type PromedioGrupoMateria = {
  materia: string;
  [grupo: string]: string | number;
};

export type HomeByRole = Record<Role, string>;

export const HOME_BY_ROLE: HomeByRole = {
  padre: "/padre",
  asesor: "/asesor",
  direccion: "/direccion",
};

export const STORAGE_KEYS = {
  session: "gab_session",
  chat: "gab_chat",
  asistencia: "gab_asistencia",
  /** Map fecha ISO → lista del día */
  asistenciaPorDia: "gab_asistencia_por_dia",
  /** Fechas ISO con lista ya guardada/cerrada */
  asistenciaCerradas: "gab_asistencia_cerradas",
  asistenciaDetalle: "gab_asistencia_detalle",
} as const;
