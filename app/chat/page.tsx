"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import RoleGuard from "@/app/components/RoleGuard";
import { useApp } from "@/app/providers/AppProvider";
import { C } from "@/lib/theme";
import type { Alumno } from "@/lib/types";

function ChatContent() {
  const { user, hijos, alumnosGrupo, chats, sendChatMessage, homeForRole } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const esAsesor = user?.role === "asesor";

  const conversaciones: Alumno[] = useMemo(() => {
    if (esAsesor) {
      // Chat 1:1 con la familia de cada alumno del grupo (prueba)
      return alumnosGrupo.map((a) => ({
        id: a.id,
        nombre: a.nombre,
        grupo: "2°B",
        asesor: user?.name || "Asesor(a)",
        materias: [],
      }));
    }
    return hijos;
  }, [esAsesor, alumnosGrupo, hijos, user?.name]);

  const inicial =
    searchParams.get("hijo") || conversaciones[0]?.id || "h1";
  const [hijoId, setHijoId] = useState(inicial);
  const [msg, setMsg] = useState("");
  const [showList, setShowList] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hijo = conversaciones.find((h) => h.id === hijoId) ?? conversaciones[0];

  useEffect(() => {
    setHijoId(inicial);
  }, [inicial]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [chats, hijoId]);

  const enviar = () => {
    if (!msg.trim() || !hijoId) return;
    sendChatMessage(hijoId, msg);
    setMsg("");
  };

  const volverA = user ? homeForRole(user.role) : "/login";
  const yoSoy = esAsesor ? "asesor" : "padre";

  if (!hijo) {
    return (
      <div style={{ background: C.paper, minHeight: "100vh" }} className="p-6 text-sm">
        No hay conversaciones.
      </div>
    );
  }

  const tituloHilo = esAsesor
    ? `Familia de ${hijo.nombre.split(" ")[0]}`
    : `${hijo.asesor} — ${hijo.grupo}`;

  return (
    <div className="flex h-[100dvh] flex-col sm:flex-row">
      <div
        style={{ background: C.card, borderRight: `1px solid ${C.line}` }}
        className={`${showList ? "flex" : "hidden"} w-full flex-col py-4 sm:flex sm:w-60 sm:shrink-0`}
      >
        <button
          onClick={() => router.push(volverA)}
          style={{ color: C.inkSoft }}
          className="mb-3 px-4 text-left text-xs hover:underline"
        >
          ← Volver
        </button>
        <p style={{ color: C.inkSoft }} className="mb-2 px-4 text-xs tracking-wide uppercase">
          {esAsesor ? "Familias del grupo" : "Conversaciones"}
        </p>
        {conversaciones.map((h) => (
          <button
            key={h.id}
            onClick={() => {
              setHijoId(h.id);
              setShowList(false);
            }}
            style={{
              background: h.id === hijoId ? C.paper : "transparent",
              borderLeft: h.id === hijoId ? `3px solid ${C.ink}` : "3px solid transparent",
            }}
            className="w-full px-4 py-3 text-left"
          >
            <p style={{ color: C.ink }} className="text-sm font-medium">
              {esAsesor ? `Familia de ${h.nombre.split(" ")[0]}` : h.asesor}
            </p>
            <p style={{ color: C.inkSoft }} className="text-xs">
              {esAsesor
                ? `${h.nombre} · ${h.grupo}`
                : `${h.nombre.split(" ")[0]} · ${h.grupo}`}
            </p>
          </button>
        ))}
      </div>

      <div
        style={{ background: C.paper }}
        className={`${showList ? "hidden" : "flex"} min-w-0 flex-1 flex-col sm:flex`}
      >
        <div
          style={{ background: C.ink, color: "#fff" }}
          className="flex items-center gap-3 px-4 py-3 sm:px-5"
        >
          <button
            className="sm:hidden"
            onClick={() => setShowList(true)}
            aria-label="Ver conversaciones"
          >
            <ArrowLeft size={18} />
          </button>
          <MessageCircle size={16} className="shrink-0" />
          <span className="truncate text-sm font-medium">{tituloHilo}</span>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
          {(chats[hijoId] || []).length === 0 && (
            <p style={{ color: C.inkSoft }} className="text-center text-sm">
              {esAsesor
                ? "Aún no hay mensajes con esta familia. Escribe el primero."
                : "Aún no hay mensajes. Escribe al asesor."}
            </p>
          )}
          {(chats[hijoId] || []).map((m, i) => {
            const mio = m.de === yoSoy;
            return (
              <div
                key={`${m.hora}-${i}-${m.texto.slice(0, 12)}`}
                className={`flex ${mio ? "justify-end" : "justify-start"}`}
              >
                <div
                  style={{
                    background: mio ? C.ink : "#fff",
                    color: mio ? "#fff" : C.ink,
                    border: mio ? "none" : `1px solid ${C.line}`,
                  }}
                  className="max-w-[85%] rounded-lg px-3 py-2 text-sm sm:max-w-xs"
                >
                  {!mio && (
                    <p style={{ opacity: 0.55 }} className="mb-0.5 text-[10px] font-medium uppercase">
                      {m.de === "padre" ? "Padre / Madre" : "Asesor(a)"}
                    </p>
                  )}
                  <p>{m.texto}</p>
                  <p style={{ opacity: 0.6 }} className="mt-1 text-[10px]">
                    {m.hora}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{ borderTop: `1px solid ${C.line}`, background: "#fff" }}
          className="flex gap-2 p-3"
        >
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder={
              esAsesor ? "Mensaje a la familia…" : "Escribe un mensaje al asesor…"
            }
            style={{ border: `1px solid ${C.line}`, color: C.ink }}
            className="flex-1 rounded-md px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={enviar}
            style={{ background: C.ink }}
            className="flex items-center justify-center rounded-md px-3 text-white"
            aria-label="Enviar"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <RoleGuard allow={["padre", "asesor"]}>
      <Suspense
        fallback={
          <div
            className="flex min-h-screen items-center justify-center"
            style={{ color: C.inkSoft }}
          >
            Cargando chat…
          </div>
        }
      >
        <ChatContent />
      </Suspense>
    </RoleGuard>
  );
}
