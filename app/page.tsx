"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers/AppProvider";
import { C } from "@/lib/theme";

export default function HomePage() {
  const { user, isInitializing, homeForRole } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(homeForRole(user.role));
  }, [homeForRole, isInitializing, router, user]);

  return (
    <div
      style={{ background: C.paper, color: C.inkSoft, minHeight: "100vh" }}
      className="flex items-center justify-center text-sm"
    >
      Cargando…
    </div>
  );
}
