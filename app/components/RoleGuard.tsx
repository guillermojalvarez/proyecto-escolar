"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers/AppProvider";
import type { Role } from "@/lib/types";
import { C } from "@/lib/theme";

export default function RoleGuard({
  allow,
  children,
}: {
  allow: Role | Role[];
  children: React.ReactNode;
}) {
  const { user, isInitializing, homeForUser } = useApp();
  const router = useRouter();
  const allowed = Array.isArray(allow) ? allow : [allow];
  const permitted = !!user && allowed.includes(user.role);

  useEffect(() => {
    if (isInitializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowed.includes(user.role) && homeForUser) {
      router.replace(homeForUser);
    }
  }, [user, isInitializing, homeForUser, router, allowed.join("|")]);

  if (isInitializing) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-sm"
        style={{ background: C.paper, color: C.inkSoft }}
      >
        Cargando…
      </div>
    );
  }

  if (!permitted) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-sm"
        style={{ background: C.paper, color: C.inkSoft }}
      >
        Redirigiendo…
      </div>
    );
  }

  return <>{children}</>;
}
