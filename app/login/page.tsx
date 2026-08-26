"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, GraduationCap, KeyRound, ShieldCheck, Users } from "lucide-react";
import { GridPaper } from "@/app/components/ui";
import { useApp } from "@/app/providers/AppProvider";
import { C, DEMO_CLAVE_ALUMNO, ESCUELA } from "@/lib/theme";

export default function LoginPage() {
  const {
    user,
    isInitializing,
    loginDemoPadre,
    loginDemoRole,
    loginWithPassword,
    homeForRole,
    hasSupabase,
  } = useApp();
  const router = useRouter();
  const [clave, setClave] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isInitializing && user) router.replace(homeForRole(user.role));
  }, [user, isInitializing, homeForRole, router]);

  const entrarDemo = () => {
    setError(null);
    const ok = loginDemoPadre(clave.trim() || DEMO_CLAVE_ALUMNO);
    if (!ok) {
      setError(`Clave no válida. En demo usa ${DEMO_CLAVE_ALUMNO}.`);
      return;
    }
    router.push("/padre");
  };

  const entrarSupabase = async () => {
    setError(null);
    if (!email.trim() || password.length < 6) {
      setError("Escribe correo y contraseña.");
      return;
    }
    setLoading(true);
    const result = await loginWithPassword(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || "No se pudo iniciar sesión.");
      return;
    }
    router.push(homeForRole(result.role ?? "padre"));
  };

  if (isInitializing) {
    return (
      <div
        style={{ background: C.paper, color: C.inkSoft, minHeight: "100vh" }}
        className="flex items-center justify-center text-sm"
      >
        Cargando…
      </div>
    );
  }

  return (
    <GridPaper style={{ minHeight: "100vh" }} className="flex items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.line}`,
          borderTop: `5px solid ${C.ink}`,
        }}
        className="w-full max-w-md rounded-lg p-6 shadow-sm sm:p-8"
      >
        <div className="mb-1 flex items-start gap-2">
          <GraduationCap size={26} color={C.ink} className="mt-0.5 shrink-0" />
          <span
            style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, color: C.ink }}
            className="text-base leading-snug sm:text-lg"
          >
            {ESCUELA.nombreCompleto}
          </span>
        </div>
        <p style={{ color: C.inkSoft }} className="mb-6 text-sm">
          Portal de padres, asesores y dirección
        </p>

        {hasSupabase && (
          <div className="mb-6">
            <p style={{ color: C.ink }} className="mb-3 text-xs font-semibold tracking-wide uppercase">
              Iniciar sesión
            </p>
            <label style={{ color: C.inkSoft }} className="mb-1 block text-xs">
              Correo
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="padre@gab.demo"
              autoComplete="email"
              style={{ border: `1px solid ${C.line}`, color: C.ink }}
              className="mb-3 w-full rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#16233F]"
            />
            <label style={{ color: C.inkSoft }} className="mb-1 block text-xs">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && void entrarSupabase()}
              style={{ border: `1px solid ${C.line}`, color: C.ink }}
              className="mb-4 w-full rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#16233F]"
            />
            <button
              onClick={() => void entrarSupabase()}
              disabled={loading}
              style={{ background: C.ink }}
              className="flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Entrando…" : "Entrar"} <ChevronRight size={16} />
            </button>
          </div>
        )}

        <div style={{ borderTop: hasSupabase ? `1px solid ${C.line}` : "none" }} className={hasSupabase ? "pt-5" : ""}>
          <p style={{ color: C.inkSoft }} className="mb-3 text-xs">
            {hasSupabase ? "Acceso rápido (demo local)" : "Acceso de demostración"}
          </p>

          <label style={{ color: C.ink }} className="mb-1 block text-xs font-medium">
            Clave del alumno
          </label>
          <div className="relative mb-3">
            <KeyRound
              size={16}
              color={C.inkSoft}
              className="absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder={DEMO_CLAVE_ALUMNO}
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                border: `1px solid ${C.line}`,
                background: "#fff",
                color: C.ink,
              }}
              className="w-full rounded-md py-2.5 pr-3 pl-9 text-sm outline-none"
              onKeyDown={(e) => e.key === "Enter" && entrarDemo()}
            />
          </div>

          <button
            onClick={entrarDemo}
            style={{
              background: hasSupabase ? "#fff" : C.ink,
              color: hasSupabase ? C.ink : "#fff",
              border: `1px solid ${C.ink}`,
            }}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition hover:opacity-90"
          >
            Entrar como padre <ChevronRight size={16} />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                loginDemoRole("asesor");
                router.push("/asesor");
              }}
              style={{ border: `1px solid ${C.ink}`, color: C.ink }}
              className="flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium hover:bg-white"
            >
              <Users size={14} /> Asesor
            </button>
            <button
              onClick={() => {
                loginDemoRole("direccion");
                router.push("/direccion");
              }}
              style={{ border: `1px solid ${C.gold}`, color: C.ink, background: C.goldSoft }}
              className="flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium"
            >
              <ShieldCheck size={14} /> Dirección
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: C.red, background: C.redSoft }} className="mt-4 rounded-md px-3 py-2 text-center text-xs">
            {error}
          </p>
        )}
      </div>
    </GridPaper>
  );
}
