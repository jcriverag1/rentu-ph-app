import { cache } from "react";
import { RolUsuario } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * TODO(auth): reemplazar por la sesión real (NextAuth/Lucia/etc.) cuando se
 * implemente autenticación. Mientras tanto, el dashboard opera como si el
 * Administrador sembrado en `prisma/seed.ts` hubiera iniciado sesión, para
 * poder construir y probar las consultas de datos end-to-end.
 */
const EMAIL_ADMIN_DEMO = "admin@rentu.com.co";

export const getAdministradorActual = cache(async () => {
  const administrador = await prisma.usuario.findFirst({
    where: {
      email: EMAIL_ADMIN_DEMO,
      rol: RolUsuario.ADMINISTRADOR,
      deletedAt: null,
    },
  });

  if (!administrador) {
    throw new Error(
      "No se encontró un usuario Administrador. ¿Corriste `pnpm prisma db seed`?"
    );
  }

  return administrador;
});
