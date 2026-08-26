import type {
  Alumno,
  AlumnoGrupo,
  Aviso,
  AsistenciaDetalle,
  ChatsPorAlumno,
  EventoAgenda,
  GrupoAdmin,
  PromedioGrupoMateria,
  ReporteConducta,
} from "@/lib/types";

export const HIJOS: Alumno[] = [
  {
    id: "h1",
    nombre: "Mateo Domínguez",
    grupo: "2°B",
    asesor: "Profa. Karla Reyes",
    materias: [
      { materia: "Español", p1: 8.6, p2: 9.0, p3: 8.8 },
      { materia: "Matemáticas", p1: 7.2, p2: 6.4, p3: 7.0 },
      { materia: "Ciencias", p1: 9.1, p2: 8.9, p3: 9.3 },
      { materia: "Historia", p1: 8.0, p2: 8.4, p3: 8.2 },
      { materia: "Inglés", p1: 9.5, p2: 9.4, p3: 9.6 },
      { materia: "Formación Cívica", p1: 8.8, p2: 9.0, p3: 8.9 },
      { materia: "Ed. Física", p1: 10, p2: 9.8, p3: 10 },
      { materia: "Artes", p1: 8.3, p2: 8.5, p3: 8.7 },
    ],
  },
  {
    id: "h2",
    nombre: "Regina Domínguez",
    grupo: "1°A",
    asesor: "Prof. Iván Torres",
    materias: [
      { materia: "Español", p1: 9.2, p2: 9.1, p3: 9.4 },
      { materia: "Matemáticas", p1: 5.8, p2: 6.2, p3: 6.9 },
      { materia: "Ciencias", p1: 8.4, p2: 8.6, p3: 8.5 },
      { materia: "Historia", p1: 9.0, p2: 8.8, p3: 9.1 },
      { materia: "Inglés", p1: 8.7, p2: 8.9, p3: 9.0 },
      { materia: "Formación Cívica", p1: 9.3, p2: 9.2, p3: 9.4 },
      { materia: "Ed. Física", p1: 9.6, p2: 9.7, p3: 9.8 },
      { materia: "Artes", p1: 9.0, p2: 9.2, p3: 9.1 },
    ],
  },
];

export const CHATS_INICIALES: ChatsPorAlumno = {
  h1: [
    {
      de: "asesor",
      texto: "Buenas tardes, le comparto que Mateo mejoró bastante en Ciencias este periodo.",
      hora: "10:12",
    },
    {
      de: "padre",
      texto: "Qué buena noticia, gracias por avisarme. ¿Cómo lo vio en Matemáticas?",
      hora: "10:15",
    },
    {
      de: "asesor",
      texto: "Ahí le falta un poco de constancia con la tarea, pero vamos a reforzarlo esta semana.",
      hora: "10:16",
    },
  ],
  h2: [
    {
      de: "asesor",
      texto: "Le escribo para comentarle que Regina participó en el concurso de oratoria.",
      hora: "09:02",
    },
    { de: "padre", texto: "¡No lo sabía! ¿Cómo le fue?", hora: "09:20" },
  ],
};

export const AVISOS: Aviso[] = [
  {
    tipo: "urgente",
    titulo: "Suspensión de clases el viernes 10",
    cuerpo: "Por junta de consejo técnico escolar no habrá clases este día.",
    fecha: "07 jul",
  },
  {
    tipo: "evento",
    titulo: "Junta de padres de familia — 2°B",
    cuerpo: "Se entregarán boletas del segundo periodo. Salón 2°B, 6:00 pm.",
    fecha: "12 jul",
  },
  {
    tipo: "info",
    titulo: "Recordatorio: pago de colegiatura",
    cuerpo: "Fecha límite sin recargo, 15 de julio.",
    fecha: "15 jul",
  },
];

export const EVENTOS_AGENDA: EventoAgenda[] = [
  { fecha: "07 jul", dia: "Mar", titulo: "Entrega de trabajo — Ciencias" },
  { fecha: "10 jul", dia: "Vie", titulo: "Sin clases (consejo técnico)" },
  { fecha: "12 jul", dia: "Dom", titulo: "Junta de padres 2°B, 6:00 pm" },
  { fecha: "18 jul", dia: "Sáb", titulo: "Examen bimestral — Matemáticas" },
  { fecha: "22 jul", dia: "Mié", titulo: "Entrega de boletas" },
];

export const PROMEDIO_POR_GRADO: Record<string, PromedioGrupoMateria[]> = {
  "1°": [
    { materia: "Español", "1°A": 8.9, "1°B": 8.4 },
    { materia: "Matemáticas", "1°A": 6.8, "1°B": 7.1 },
    { materia: "Ciencias", "1°A": 8.5, "1°B": 8.2 },
    { materia: "Historia", "1°A": 8.7, "1°B": 8.3 },
    { materia: "Inglés", "1°A": 8.8, "1°B": 8.6 },
  ],
  "2°": [
    { materia: "Español", "2°A": 8.3, "2°B": 8.8 },
    { materia: "Matemáticas", "2°A": 6.5, "2°B": 7.0 },
    { materia: "Ciencias", "2°A": 8.0, "2°B": 9.1 },
    { materia: "Historia", "2°A": 7.9, "2°B": 8.2 },
    { materia: "Inglés", "2°A": 8.4, "2°B": 9.4 },
  ],
  "3°": [
    { materia: "Español", "3°A": 9.0, "3°B": 8.6 },
    { materia: "Matemáticas", "3°A": 7.4, "3°B": 7.0 },
    { materia: "Ciencias", "3°A": 8.9, "3°B": 8.5 },
    { materia: "Historia", "3°A": 8.8, "3°B": 8.4 },
    { materia: "Inglés", "3°A": 9.2, "3°B": 8.9 },
  ],
};

export const REPORTES_CONDUCTA: Record<string, ReporteConducta[]> = {
  h1: [
    {
      tipo: "positivo",
      fecha: "03 jul",
      titulo: "Participación destacada en Ciencias",
      detalle: "Apoyó a sus compañeros durante la práctica de laboratorio.",
      reporta: "Profa. Karla Reyes",
    },
    {
      tipo: "negativo",
      fecha: "28 jun",
      titulo: "Tareas incompletas",
      detalle: "No entregó la tarea de Matemáticas por segunda vez en la semana.",
      reporta: "Profa. Karla Reyes",
    },
  ],
  h2: [
    {
      tipo: "positivo",
      fecha: "01 jul",
      titulo: "Representó a la escuela en oratoria",
      detalle: "Obtuvo segundo lugar en el concurso zonal de oratoria.",
      reporta: "Prof. Iván Torres",
    },
  ],
};

/** Fecha “de hoy” de la demo (congelada para que calendario y lista coincidan). */
export const HOY = new Date(2026, 6, 10);
export const DEMO_FECHA_ISO = "2026-07-10";
export const GRUPO_ASESOR = "2°B";

export const ASISTENCIA_DETALLE: AsistenciaDetalle = {
  h1: { 3: "falta", 7: "retardo", 9: "falta" },
  h2: { 6: "retardo" },
};

/**
 * Lista de prueba del grupo del asesor (2°B).
 * Más adelante se puede reemplazar por alumnos traídos de Supabase.
 */
export const ALUMNOS_2B: AlumnoGrupo[] = [
  { id: "h1", nombre: "Mateo Domínguez" },
  { id: "a2", nombre: "Ana Sofía Delgado" },
  { id: "a3", nombre: "Bruno Castillo" },
  { id: "a4", nombre: "Camila Rivas" },
  { id: "a5", nombre: "Diego Salcedo" },
  { id: "a6", nombre: "Elena Márquez" },
  { id: "a7", nombre: "Fernando Ibarra" },
  { id: "a8", nombre: "Gael Ponce" },
];

/** Promedios de prueba del 2°B (reemplazables por Supabase). */
export const CALIFS_PRUEBA_2B: { id: string; nombre: string; promedio: number }[] = [
  { id: "h1", nombre: "Mateo Domínguez", promedio: 8.9 },
  { id: "a2", nombre: "Ana Sofía Delgado", promedio: 9.1 },
  { id: "a3", nombre: "Bruno Castillo", promedio: 7.4 },
  { id: "a4", nombre: "Camila Rivas", promedio: 8.6 },
  { id: "a5", nombre: "Diego Salcedo", promedio: 6.2 },
  { id: "a6", nombre: "Elena Márquez", promedio: 8.8 },
  { id: "a7", nombre: "Fernando Ibarra", promedio: 7.9 },
  { id: "a8", nombre: "Gael Ponce", promedio: 8.3 },
];

export const GRUPOS_ADMIN: GrupoAdmin[] = [
  { grupo: "1°A", asesor: "Prof. Iván Torres", alumnos: 32, promedio: 8.7 },
  { grupo: "1°B", asesor: "Profa. Lucía Nava", alumnos: 30, promedio: 8.3 },
  { grupo: "2°A", asesor: "Prof. Édgar Ramos", alumnos: 31, promedio: 8.1 },
  { grupo: "2°B", asesor: "Profa. Karla Reyes", alumnos: 29, promedio: 8.6 },
  { grupo: "3°A", asesor: "Profa. Sofía Delgado", alumnos: 28, promedio: 8.9 },
  { grupo: "3°B", asesor: "Prof. Marco Villegas", alumnos: 30, promedio: 8.4 },
];

export const NOMBRE_MES = HOY.toLocaleDateString("es-MX", {
  month: "long",
  year: "numeric",
});
