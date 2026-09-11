import { cache } from "react";
import { redirect } from "next/navigation";
import { RolUsuario } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Identidad = Supabase Auth (email/password); autorización = el registro de
 * `Usuario` en Prisma con ese mismo email. El Proxy (`src/proxy.ts`) ya
 * redirige a `/login` a quien no tenga sesión antes de llegar aquí, pero se
 * revalida por si esta función se invoca desde algún contexto que el Proxy
 * no cubra.
 */
export const getAdministradorActual = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const administrador = await prisma.usuario.findFirst({
    where: {
      email: user.email,
      rol: RolUsuario.ADMINISTRADOR,
      deletedAt: null,
    },
  });

  if (!administrador) {
    redirect("/login");
  }

  return administrador;
});
