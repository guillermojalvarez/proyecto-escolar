import React, { useState, useRef, useEffect } from "react";
import {
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Users,
  ChevronRight,
  Send,
  BookOpen,
  ClipboardList,
  LogOut,
  KeyRound,
  Bell,
  AlertTriangle,
  PartyPopper,
  Info,
  CalendarDays,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  FileDown,
  Printer,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ---------- Escuela ---------- */
const ESCUELA = {
  nombreCompleto:
    "Escuela Secundaria Profesor y Licenciado Guillermo J. Alvarez Briseño",
  nombreCorto: "Guillermo J. Alvarez Briseño",
  etiqueta: "Esc. Sec. Guillermo J. Alvarez Briseño",
  tipo: "Escuela Secundaria General",
  ciclo: "2025–2026",
};

/* ---------- Tokens ---------- */
const C = {
  ink: "#16233F",
  inkSoft: "#3A4A6B",
  paper: "#F1F3EE",
  line: "#D9DECF",
  card: "#FCFCF9",
  red: "#C1352B",
  redSoft: "#F4DEDB",
  green: "#2F6B4F",
  greenSoft: "#DEEAE2",
  gold: "#B8912A",
  goldSoft: "#F1E7CC",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

@media print {
  body * { visibility: hidden; }
  #boleta-imprimible, #boleta-imprimible * { visibility: visible; }
  #boleta-imprimible { position: absolute; left: 0; top: 0; width: 100%; }
  .no-imprimir { display: none !important; }
}
`;

/* ---------- Mock data ---------- */
const HIJOS = [
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

const CHATS_INICIALES = {
  h1: [
    { de: "asesor", texto: "Buenas tardes, le comparto que Mateo mejoró bastante en Ciencias este periodo.", hora: "10:12" },
    { de: "padre", texto: "Qué buena noticia, gracias por avisarme. ¿Cómo lo vio en Matemáticas?", hora: "10:15" },
    { de: "asesor", texto: "Ahí le falta un poco de constancia con la tarea, pero vamos a reforzarlo esta semana.", hora: "10:16" },
  ],
  h2: [
    { de: "asesor", texto: "Le escribo para comentarle que Regina participó en el concurso de oratoria.", hora: "09:02" },
    { de: "padre", texto: "¡No lo sabía! ¿Cómo le fue?", hora: "09:20" },
  ],
};

const AVISOS = [
  {
    tipo: "urgente",
    titulo: "Suspensión de clases el viernes 10",
    cuerpo: "Por junta de consejo técnico escolar no habrá clases este día.",
    fecha: "07 jul",
  },
  {
    tipo: "evento",
    titulo: "Junta de padres de familia — 2°B",
    cuerpo: "Se entregarán boletas del segundo periodo. Salón 2B, 6:00 pm.",
    fecha: "12 jul",
  },
  {
    tipo: "info",
    titulo: "Recordatorio: pago de colegiatura",
    cuerpo: "Fecha límite sin recargo, 15 de julio.",
    fecha: "15 jul",
  },
];

const AVISO_ESTILO = {
  urgente: { icon: AlertTriangle, color: C.red, bg: C.redSoft },
  evento: { icon: PartyPopper, color: C.gold, bg: C.goldSoft },
  info: { icon: Info, color: C.ink, bg: "#E6E9E2" },
};

const EVENTOS_AGENDA = [
  { fecha: "07 jul", dia: "Mar", titulo: "Entrega de trabajo — Ciencias" },
  { fecha: "10 jul", dia: "Vie", titulo: "Sin clases (consejo técnico)" },
  { fecha: "12 jul", dia: "Dom", titulo: "Junta de padres 2°B, 6:00 pm" },
  { fecha: "18 jul", dia: "Sáb", titulo: "Examen bimestral — Matemáticas" },
  { fecha: "22 jul", dia: "Mié", titulo: "Entrega de boletas" },
];

const PROMEDIO_POR_GRADO = {
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

const REPORTES_CONDUCTA = {
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

const CONDUCTA_ESTILO = {
  positivo: { icon: ThumbsUp, color: C.green, bg: C.greenSoft },
  negativo: { icon: ThumbsDown, color: C.red, bg: C.redSoft },
};

const ASISTENCIA_ESTILO = {
  presente: { icon: CheckCircle2, color: C.green, bg: C.greenSoft, label: "Presente" },
  falta: { icon: XCircle, color: C.red, bg: C.redSoft, label: "Falta" },
  retardo: { icon: Clock, color: C.gold, bg: C.goldSoft, label: "Retardo" },
};

const ESTILO_CALENDARIO = {
  ...ASISTENCIA_ESTILO,
  noclase: { color: C.inkSoft, bg: "transparent", label: "Sin clase" },
  pendiente: { color: C.inkSoft, bg: C.paper, label: "Pendiente" },
};

const HOY = new Date(2026, 6, 10);

const ASISTENCIA_DETALLE = {
  h1: { 3: "falta", 7: "retardo", 9: "falta" },
  h2: { 6: "retardo" },
};

function estadoDelDia(hijoId, fecha) {
  if (fecha > HOY) return "pendiente";
  const diaSemana = fecha.getDay();
  if (diaSemana === 0 || diaSemana === 6) return "noclase";
  const overrides = ASISTENCIA_DETALLE[hijoId] || {};
  return overrides[fecha.getDate()] || "presente";
}

function matrizDelMes(anio, mes) {
  const primerDia = new Date(anio, mes, 1);
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const offset = (primerDia.getDay() + 6) % 7;
  const celdas = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null);
  const semanas = [];
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7));
  return semanas;
}

const NOMBRE_MES = HOY.toLocaleDateString("es-MX", { month: "long", year: "numeric" });

const ALUMNOS_2B = [
  { id: "h1", nombre: "Mateo Domínguez" },
  { id: "a2", nombre: "Ana Sofía Delgado" },
  { id: "a3", nombre: "Bruno Castillo" },
  { id: "a4", nombre: "Camila Rivas" },
  { id: "a5", nombre: "Diego Salcedo" },
  { id: "a6", nombre: "Elena Márquez" },
  { id: "a7", nombre: "Fernando Ibarra" },
  { id: "a8", nombre: "Gael Ponce" },
];

const GRUPOS_ADMIN = [
  { grupo: "1°A", asesor: "Prof. Iván Torres", alumnos: 32, promedio: 8.7 },
  { grupo: "1°B", asesor: "Profa. Lucía Nava", alumnos: 30, promedio: 8.3 },
  { grupo: "2°A", asesor: "Prof. Édgar Ramos", alumnos: 31, promedio: 8.1 },
  { grupo: "2°B", asesor: "Profa. Karla Reyes", alumnos: 29, promedio: 8.6 },
  { grupo: "3°A", asesor: "Profa. Sofía Delgado", alumnos: 28, promedio: 8.9 },
  { grupo: "3°B", asesor: "Prof. Marco Villegas", alumnos: 30, promedio: 8.4 },
];

/* ---------- Utilidades visuales ---------- */
function GridPaper({ children, style, ...props }) {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
        backgroundColor: C.paper,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function CalifPill({ valor }) {
  const aprobado = valor >= 6;
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
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

function DemoNav({ view, setView }) {
  const items = [
    { id: "login", label: "Inicio" },
    { id: "parent", label: "Vista Padre" },
    { id: "chat", label: "Chat" },
    { id: "asesor", label: "Vista Asesor" },
    { id: "admin", label: "Vista Dirección" },
  ];
  return (
    <div
      style={{
        background: C.ink,
        color: "#fff",
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: "0.78rem",
      }}
      className="flex items-center justify-between px-4 py-2"
    >
      <span style={{ opacity: 0.65 }}>Prototipo — navegación de demostración</span>
      <div className="flex gap-1">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setView(it.id)}
            style={{
              background: view === it.id ? "#fff" : "transparent",
              color: view === it.id ? C.ink : "#fff",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CalendarioMensual({ titulo, semanas, renderCelda, leyenda }) {
  const dias = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold capitalize">
          {titulo}
        </span>
        <span style={{ color: C.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }} className="text-xs capitalize">
          {NOMBRE_MES}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dias.map((d, i) => (
          <div key={i} style={{ color: C.inkSoft }} className="text-center text-[10px] font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {semanas.map((semana, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {semana.map((dia, di) => (
              <div key={di} className="aspect-square">{dia && renderCelda(dia)}</div>
            ))}
          </div>
        ))}
      </div>

      {leyenda && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
          {leyenda.map((l, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span style={{ background: l.color, width: 8, height: 8, borderRadius: "50%" }} />
              <span style={{ color: C.inkSoft }} className="text-[11px]">{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Pantalla: Login ---------- */
function LoginScreen({ onEntrar }) {
  const [clave, setClave] = useState("");
  return (
    <GridPaper style={{ minHeight: "100%" }} className="flex items-center justify-center px-6 py-16">
      <div
        style={{ background: C.card, border: `1px solid ${C.line}`, borderTop: `5px solid ${C.ink}` }}
        className="w-full max-w-md rounded-lg shadow-sm p-8"
      >
        <div className="flex items-start gap-2 mb-1">
          <GraduationCap size={26} color={C.ink} className="shrink-0 mt-0.5" />
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: C.ink }} className="text-lg leading-snug">
            {ESCUELA.nombreCompleto}
          </span>
        </div>
        <p style={{ color: C.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }} className="text-sm mb-6">
          Portal de padres de familia
        </p>

        <label style={{ color: C.ink, fontFamily: "'IBM Plex Sans', sans-serif" }} className="text-xs font-medium block mb-1">
          Clave única del alumno
        </label>
        <div className="relative mb-5">
          <KeyRound size={16} color={C.inkSoft} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Ej. GAB-2026-0451"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              border: `1px solid ${C.line}`,
              background: "#fff",
              color: C.ink,
            }}
            className="w-full rounded-md pl-9 pr-3 py-2 text-sm outline-none"
          />
        </div>

        <button
          onClick={onEntrar}
          style={{ background: C.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}
          className="w-full text-white rounded-md py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
        >
          Entrar <ChevronRight size={16} />
        </button>

        <p style={{ color: C.inkSoft }} className="text-xs text-center mt-5">
          ¿Olvidaste tu clave? Contacta a la dirección escolar.
        </p>
      </div>
    </GridPaper>
  );
}

function AvisosCard() {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={16} color={C.ink} />
        <span style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold">
          Avisos
        </span>
      </div>
      <div className="space-y-2">
        {AVISOS.map((a, i) => {
          const est = AVISO_ESTILO[a.tipo];
          const Icon = est.icon;
          return (
            <div key={i} style={{ background: est.bg }} className="rounded-md p-3 flex gap-2.5">
              <Icon size={16} color={est.color} className="shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <p style={{ color: C.ink }} className="text-sm font-medium">{a.titulo}</p>
                  <span style={{ color: est.color, fontFamily: "'IBM Plex Mono', monospace" }} className="text-[10px]">
                    {a.fecha}
                  </span>
                </div>
                <p style={{ color: C.inkSoft }} className="text-xs mt-0.5">{a.cuerpo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaCard() {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={16} color={C.ink} />
        <span style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold">
          Próximos eventos
        </span>
      </div>
      <div>
        {EVENTOS_AGENDA.map((e, i) => (
          <div
            key={i}
            style={{ borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}
            className="flex items-center gap-3 py-2.5"
          >
            <div
              style={{ background: C.paper, color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }}
              className="rounded-md w-12 h-12 flex flex-col items-center justify-center shrink-0"
            >
              <span className="text-[10px] leading-none">{e.dia}</span>
              <span className="text-sm font-semibold leading-none mt-1">{e.fecha.split(" ")[0]}</span>
            </div>
            <p style={{ color: C.ink }} className="text-sm">{e.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportesConductaCard({ hijoId }) {
  const reportes = REPORTES_CONDUCTA[hijoId] || [];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <ThumbsUp size={16} color={C.ink} />
        <span style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold">
          Reportes de conducta
        </span>
      </div>
      {reportes.length === 0 && (
        <p style={{ color: C.inkSoft }} className="text-sm">Sin reportes registrados este periodo.</p>
      )}
      <div className="space-y-2">
        {reportes.map((r, i) => {
          const est = CONDUCTA_ESTILO[r.tipo];
          const Icon = est.icon;
          return (
            <div key={i} style={{ background: est.bg }} className="rounded-md p-3 flex gap-2.5">
              <Icon size={16} color={est.color} className="shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <p style={{ color: C.ink }} className="text-sm font-medium">{r.titulo}</p>
                  <span style={{ color: est.color, fontFamily: "'IBM Plex Mono', monospace" }} className="text-[10px]">
                    {r.fecha}
                  </span>
                </div>
                <p style={{ color: C.inkSoft }} className="text-xs mt-0.5">{r.detalle}</p>
                <p style={{ color: est.color }} className="text-[11px] mt-1">Registró: {r.reporta}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Boleta descargable ---------- */
function BoletaDocumento({ hijo }) {
  const promedios = hijo.materias.map((m) => (m.p1 + m.p2 + m.p3) / 3);
  const promedioFinal = (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(1);

  return (
    <div id="boleta-imprimible" style={{ background: "#fff", fontFamily: "'IBM Plex Sans', sans-serif" }} className="p-8">
      <div style={{ borderBottom: `2px solid ${C.ink}` }} className="flex items-start justify-between gap-4 pb-4 mb-5">
        <div className="flex items-start gap-2">
          <GraduationCap size={24} color={C.ink} className="shrink-0 mt-0.5" />
          <div>
            <p style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold leading-tight">
              {ESCUELA.nombreCompleto}
            </p>
            <p style={{ color: C.inkSoft }} className="text-xs">
              {ESCUELA.tipo} · Ciclo escolar {ESCUELA.ciclo}
            </p>
          </div>
        </div>
        <p style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="text-xs shrink-0">
          Boleta oficial · 3er periodo
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5 text-sm">
        <p style={{ color: C.ink }}><span style={{ color: C.inkSoft }}>Alumno(a): </span>{hijo.nombre}</p>
        <p style={{ color: C.ink }}><span style={{ color: C.inkSoft }}>Grupo: </span>{hijo.grupo}</p>
        <p style={{ color: C.ink }}><span style={{ color: C.inkSoft }}>Asesor(a): </span>{hijo.asesor}</p>
        <p style={{ color: C.ink }}><span style={{ color: C.inkSoft }}>Fecha de emisión: </span>07/jul/2026</p>
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
              <td style={{ color: C.ink }} className="py-1.5">{m.materia}</td>
              <td className="py-1.5 text-center" style={{ color: C.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>{m.p1.toFixed(1)}</td>
              <td className="py-1.5 text-center" style={{ color: C.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>{m.p2.toFixed(1)}</td>
              <td className="py-1.5 text-center" style={{ color: C.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>{m.p3.toFixed(1)}</td>
              <td className="py-1.5 text-center font-semibold" style={{ color: promedios[i] >= 6 ? C.green : C.red, fontFamily: "'IBM Plex Mono', monospace" }}>
                {promedios[i].toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-10">
        <div style={{ border: `1.5px solid ${C.ink}` }} className="rounded-md px-4 py-2 text-right">
          <p style={{ color: C.inkSoft }} className="text-xs">Promedio general</p>
          <p style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="text-xl font-semibold">{promedioFinal}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 text-center text-xs" style={{ color: C.inkSoft }}>
        <div>
          <div style={{ borderTop: `1px solid ${C.ink}` }} className="pt-1">Director(a)</div>
        </div>
        <div>
          <div style={{ borderTop: `1px solid ${C.ink}` }} className="pt-1">Asesor(a)</div>
        </div>
        <div>
          <div style={{ borderTop: `1px solid ${C.ink}` }} className="pt-1">Padre / Tutor</div>
        </div>
      </div>
    </div>
  );
}

function BoletaModal({ hijo, onClose }) {
  return (
    <div
      className="no-imprimir fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(22,35,63,0.55)" }}
    >
      <div style={{ background: "#fff", maxHeight: "90vh" }} className="w-full max-w-xl rounded-lg overflow-y-auto shadow-xl">
        <div
          className="no-imprimir flex items-center justify-between px-5 py-3 sticky top-0"
          style={{ background: C.ink, color: "#fff" }}
        >
          <span className="text-sm font-medium">Vista previa de boleta</span>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 text-sm">
              <Printer size={15} /> Descargar / imprimir
            </button>
            <button onClick={onClose}><X size={18} /></button>
          </div>
        </div>
        <BoletaDocumento hijo={hijo} />
      </div>
    </div>
  );
}

function AsistenciaCard({ hijoId }) {
  const semanas = matrizDelMes(2026, 6);
  const faltas = semanas.flat().filter(
    (d) => d && estadoDelDia(hijoId, new Date(2026, 6, d)) === "falta"
  ).length;
  const retardos = semanas.flat().filter(
    (d) => d && estadoDelDia(hijoId, new Date(2026, 6, d)) === "retardo"
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
          const estado = estadoDelDia(hijoId, fecha);
          const est = ESTILO_CALENDARIO[estado];
          return (
            <div
              style={{
                background: est.bg,
                color: estado === "noclase" ? C.inkSoft : est.color,
                border: estado === "presente" || estado === "falta" || estado === "retardo" ? `1px solid ${est.color}` : "none",
              }}
              className="w-full h-full rounded-md flex items-center justify-center text-[11px] font-medium"
            >
              {dia}
            </div>
          );
        }}
      />
      <p style={{ color: C.inkSoft }} className="text-xs mt-2 px-1">
        {faltas} falta{faltas !== 1 ? "s" : ""} · {retardos} retardo{retardos !== 1 ? "s" : ""} este mes
      </p>
    </div>
  );
}

/* ---------- Pantalla: Padre ---------- */
function ParentScreen({ onIrAChat }) {
  const [hijoId, setHijoId] = useState(HIJOS[0].id);
  const [showBoleta, setShowBoleta] = useState(false);
  const hijo = HIJOS.find((h) => h.id === hijoId);
  const promedio = (hijo.materias.reduce((s, m) => s + m.p3, 0) / hijo.materias.length).toFixed(1);

  return (
    <div style={{ background: C.paper, minHeight: "100%", fontFamily: "'IBM Plex Sans', sans-serif" }} className="pb-16">
      <div style={{ background: C.ink }} className="px-6 py-5 flex items-center justify-between text-white gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <GraduationCap size={22} className="shrink-0" />
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }} className="text-base sm:text-lg leading-snug truncate">
            {ESCUELA.etiqueta}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-80 shrink-0">
          <span>Familia Domínguez</span>
          <LogOut size={16} />
        </div>
      </div>

      <div className="px-6 pt-5 flex gap-2">
        {HIJOS.map((h) => (
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

      <div className="px-6 pt-5 grid grid-cols-3 gap-3">
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4 col-span-2">
          <p style={{ color: C.inkSoft }} className="text-xs mb-1">
            {hijo.grupo} · Asesor(a)
          </p>
          <p style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold text-lg">
            {hijo.nombre}
          </p>
          <p style={{ color: C.inkSoft }} className="text-sm">
            {hijo.asesor}
          </p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <button
              onClick={() => onIrAChat(hijo)}
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
        <div style={{ background: C.goldSoft, border: `1px solid ${C.gold}` }} className="rounded-lg p-4 flex flex-col justify-center items-center">
          <p style={{ color: C.gold }} className="text-xs mb-1">Promedio actual</p>
          <p style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="text-2xl font-semibold">
            {promedio}
          </p>
        </div>
      </div>

      <div className="px-6 pt-5">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList size={16} color={C.ink} />
          <span style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold">
            Calificaciones
          </span>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg overflow-hidden">
          <table className="w-full text-sm">
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
                  <td className="py-2 px-3 text-center"><CalifPill valor={m.p1} /></td>
                  <td className="py-2 px-3 text-center"><CalifPill valor={m.p2} /></td>
                  <td className="py-2 px-3 text-center"><CalifPill valor={m.p3} /></td>
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

/* ---------- Pantalla: Chat ---------- */
function ChatScreen({ hijoInicial }) {
  const [hijoId, setHijoId] = useState(hijoInicial?.id || HIJOS[0].id);
  const [chats, setChats] = useState(CHATS_INICIALES);
  const [msg, setMsg] = useState("");
  const scrollRef = useRef(null);
  const hijo = HIJOS.find((h) => h.id === hijoId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [chats, hijoId]);

  const enviar = () => {
    if (!msg.trim()) return;
    setChats((prev) => ({
      ...prev,
      [hijoId]: [...prev[hijoId], { de: "padre", texto: msg, hora: "ahora" }],
    }));
    setMsg("");
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }} className="flex h-full min-h-[560px]">
      <div style={{ background: C.card, borderRight: `1px solid ${C.line}` }} className="w-56 shrink-0 py-4">
        <p style={{ color: C.inkSoft }} className="text-xs px-4 mb-2 uppercase tracking-wide">Conversaciones</p>
        {HIJOS.map((h) => (
          <button
            key={h.id}
            onClick={() => setHijoId(h.id)}
            style={{
              background: h.id === hijoId ? C.paper : "transparent",
              borderLeft: h.id === hijoId ? `3px solid ${C.ink}` : "3px solid transparent",
            }}
            className="w-full text-left px-4 py-3"
          >
            <p style={{ color: C.ink }} className="text-sm font-medium">{h.asesor}</p>
            <p style={{ color: C.inkSoft }} className="text-xs">Asesor(a) de {h.nombre.split(" ")[0]} · {h.grupo}</p>
          </button>
        ))}
      </div>

      <div style={{ background: C.paper }} className="flex-1 flex flex-col">
        <div style={{ background: C.ink, color: "#fff" }} className="px-5 py-3 flex items-center gap-2">
          <MessageCircle size={16} />
          <span className="text-sm font-medium">{hijo.asesor} — {hijo.grupo}</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {chats[hijoId].map((m, i) => (
            <div key={i} className={`flex ${m.de === "padre" ? "justify-end" : "justify-start"}`}>
              <div
                style={{
                  background: m.de === "padre" ? C.ink : "#fff",
                  color: m.de === "padre" ? "#fff" : C.ink,
                  border: m.de === "padre" ? "none" : `1px solid ${C.line}`,
                }}
                className="max-w-xs rounded-lg px-3 py-2 text-sm"
              >
                <p>{m.texto}</p>
                <p style={{ opacity: 0.6 }} className="text-[10px] mt-1">{m.hora}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.line}`, background: "#fff" }} className="p-3 flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder="Escribe un mensaje…"
            style={{ border: `1px solid ${C.line}`, color: C.ink }}
            className="flex-1 rounded-md px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={enviar}
            style={{ background: C.ink }}
            className="text-white rounded-md px-3 flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function pctAsistenciaGrupo(grupo, dia) {
  const seed = grupo.charCodeAt(0) * 3 + grupo.charCodeAt(grupo.length - 1) * 7 + dia * 5;
  return 90 + (seed % 9);
}

function bandaPct(pct) {
  if (pct >= 97) return { color: C.green, bg: C.greenSoft };
  if (pct >= 93) return { color: C.gold, bg: C.goldSoft };
  return { color: C.red, bg: C.redSoft };
}

function ComparativaMaterias() {
  const [grado, setGrado] = useState("1°");
  const data = PROMEDIO_POR_GRADO[grado];
  const grupos = Object.keys(data[0]).filter((k) => k !== "materia");
  const colores = [C.ink, C.gold, C.red];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4 mt-3">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} color={C.ink} />
          <span style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold">
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
          <XAxis dataKey="materia" tick={{ fill: C.inkSoft, fontSize: 11 }} axisLine={{ stroke: C.line }} tickLine={false} />
          <YAxis domain={[0, 10]} tick={{ fill: C.inkSoft, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, borderColor: C.line }}
            cursor={{ fill: C.paper }}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'IBM Plex Sans', sans-serif" }} />
          {grupos.map((g, i) => (
            <Bar key={g} dataKey={g} fill={colores[i % colores.length]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- Pantalla: Asesor ---------- */
function AsesorScreen() {
  const [lista, setLista] = useState(
    Object.fromEntries(ALUMNOS_2B.map((a) => [a.id, "presente"]))
  );
  const [guardado, setGuardado] = useState(false);

  const marcar = (id, estado) => {
    setLista((prev) => ({ ...prev, [id]: estado }));
    setGuardado(false);
  };

  const conteo = Object.values(lista).reduce(
    (acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }),
    {}
  );

  return (
    <div style={{ background: C.paper, fontFamily: "'IBM Plex Sans', sans-serif" }} className="min-h-full pb-16">
      <div style={{ background: C.ink }} className="px-6 py-5 flex items-center justify-between text-white gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={22} />
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }} className="text-lg">
            Lista de asistencia — 2°B
          </span>
        </div>
        <span className="text-sm opacity-80">
          Profa. Karla Reyes · {HOY.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      </div>

      <div className="px-6 pt-4">
        <div style={{ background: C.goldSoft, border: `1px solid ${C.gold}` }} className="rounded-md px-3 py-2 flex items-center gap-2">
          <Clock size={14} color={C.gold} />
          <p style={{ color: C.ink }} className="text-xs">
            Solo puedes tomar asistencia del día de hoy. Los registros de días anteriores ya no se pueden modificar aquí; si necesitas corregir uno, pide apoyo a Dirección.
          </p>
        </div>
      </div>

      <div className="px-6 pt-5 grid grid-cols-3 gap-3">
        <div style={{ background: C.greenSoft, border: `1px solid ${C.green}` }} className="rounded-lg p-3 text-center">
          <p style={{ color: C.green }} className="text-xs">Presentes</p>
          <p style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="text-xl font-semibold">
            {conteo.presente || 0}
          </p>
        </div>
        <div style={{ background: C.redSoft, border: `1px solid ${C.red}` }} className="rounded-lg p-3 text-center">
          <p style={{ color: C.red }} className="text-xs">Faltas</p>
          <p style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="text-xl font-semibold">
            {conteo.falta || 0}
          </p>
        </div>
        <div style={{ background: C.goldSoft, border: `1px solid ${C.gold}` }} className="rounded-lg p-3 text-center">
          <p style={{ color: C.gold }} className="text-xs">Retardos</p>
          <p style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="text-xl font-semibold">
            {conteo.retardo || 0}
          </p>
        </div>
      </div>

      <div className="px-6 pt-5">
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg overflow-hidden">
          {ALUMNOS_2B.map((a, i) => (
            <div
              key={a.id}
              style={{ borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}
              className="flex items-center justify-between px-4 py-3 gap-3 flex-wrap"
            >
              <span style={{ color: C.ink }} className="text-sm font-medium">{a.nombre}</span>
              <div className="flex gap-1.5">
                {["presente", "falta", "retardo"].map((estado) => {
                  const est = ASISTENCIA_ESTILO[estado];
                  const Icon = est.icon;
                  const activo = lista[a.id] === estado;
                  return (
                    <button
                      key={estado}
                      onClick={() => marcar(a.id, estado)}
                      style={{
                        background: activo ? est.bg : "#fff",
                        border: `1px solid ${activo ? est.color : C.line}`,
                        color: activo ? est.color : C.inkSoft,
                      }}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium flex items-center gap-1"
                    >
                      <Icon size={13} /> {est.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setGuardado(true)}
          style={{ background: C.ink }}
          className="mt-4 text-white rounded-md px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Guardar lista del día
        </button>
        {guardado && (
          <span style={{ color: C.green }} className="ml-3 text-sm">
            ✓ Lista guardada — visible para los padres
          </span>
        )}
      </div>
    </div>
  );
}

function AsistenciaGeneralAdmin() {
  const [grupo, setGrupo] = useState(GRUPOS_ADMIN[0].grupo);
  const semanas = matrizDelMes(2026, 6);
  const diasHabiles = semanas.flat().filter((d) => {
    if (!d) return false;
    const fecha = new Date(2026, 6, d);
    const ds = fecha.getDay();
    return ds !== 0 && ds !== 6 && fecha <= HOY;
  });
  const promedioMes = diasHabiles.length
    ? Math.round(diasHabiles.reduce((s, d) => s + pctAsistenciaGrupo(grupo, d), 0) / diasHabiles.length)
    : 0;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4 mt-3">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={16} color={C.ink} />
          <span style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold">
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
        <span style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{promedioMes}%</span>
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
            return <div className="w-full h-full rounded-md flex items-center justify-center text-[11px]" style={{ color: C.inkSoft }}>{dia}</div>;
          }
          if (fecha > HOY) {
            return <div style={{ background: C.paper }} className="w-full h-full rounded-md flex items-center justify-center text-[11px]">{dia}</div>;
          }
          const pct = pctAsistenciaGrupo(grupo, dia);
          const banda = bandaPct(pct);
          return (
            <div
              style={{ background: banda.bg, color: banda.color, border: `1px solid ${banda.color}` }}
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

/* ---------- Pantalla: Dirección ---------- */
function AdminScreen() {
  const totalAlumnos = GRUPOS_ADMIN.reduce((s, g) => s + g.alumnos, 0);
  const promedioGeneral = (GRUPOS_ADMIN.reduce((s, g) => s + g.promedio, 0) / GRUPOS_ADMIN.length).toFixed(1);

  return (
    <div style={{ background: C.paper, fontFamily: "'IBM Plex Sans', sans-serif" }} className="min-h-full pb-12">
      <div style={{ background: C.gold }} className="px-6 py-5 flex items-center gap-2 text-white">
        <ShieldCheck size={22} className="shrink-0" />
        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }} className="text-base sm:text-lg leading-snug">
          Dirección — {ESCUELA.etiqueta}
        </span>
      </div>

      <div className="px-6 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
          <p style={{ color: C.inkSoft }} className="text-xs mb-1">Alumnos inscritos</p>
          <p style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="text-2xl font-semibold">{totalAlumnos}</p>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
          <p style={{ color: C.inkSoft }} className="text-xs mb-1">Promedio general</p>
          <p style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="text-2xl font-semibold">{promedioGeneral}</p>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg p-4">
          <p style={{ color: C.inkSoft }} className="text-xs mb-1">Grupos activos</p>
          <p style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="text-2xl font-semibold">{GRUPOS_ADMIN.length}</p>
        </div>
      </div>

      <div className="px-6 pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} color={C.ink} />
          <span style={{ color: C.ink, fontFamily: "'Fraunces', serif" }} className="font-semibold">
            Grupos y asesores
          </span>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded-lg overflow-hidden">
          <table className="w-full text-sm">
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
                  <td style={{ color: C.ink, fontFamily: "'IBM Plex Mono', monospace" }} className="py-2 px-3 font-medium">{g.grupo}</td>
                  <td style={{ color: C.ink }} className="py-2 px-3">
                    <span className="inline-flex items-center gap-2">
                      <BookOpen size={14} color={C.inkSoft} /> {g.asesor}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center" style={{ color: C.inkSoft }}>{g.alumnos}</td>
                  <td className="py-2 px-3 text-center"><CalifPill valor={g.promedio} /></td>
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

/* ---------- App ---------- */
export default function PortalEscolar() {
  const [view, setView] = useState("login");
  const [hijoChat, setHijoChat] = useState(null);

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{FONTS}</style>
      <DemoNav view={view} setView={setView} />
      <div style={{ minHeight: "calc(100vh - 34px)" }}>
        {view === "login" && <LoginScreen onEntrar={() => setView("parent")} />}
        {view === "parent" && (
          <ParentScreen
            onIrAChat={(h) => {
              setHijoChat(h);
              setView("chat");
            }}
          />
        )}
        {view === "chat" && <ChatScreen hijoInicial={hijoChat} />}
        {view === "asesor" && <AsesorScreen />}
        {view === "admin" && <AdminScreen />}
      </div>
    </div>
  );
}
