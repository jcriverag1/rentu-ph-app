import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Inmuebles de una copropiedad administrada por `administradorId`.
 * El filtro por administrador se aplica siempre a nivel de query (nunca
 * confiando en lo que llegue del cliente) para no filtrar datos de
 * copropiedades ajenas.
 */
export const getInmueblesPorCopropiedad = cache(
  async (copropiedadId: string, administradorId: string) => {
    return prisma.inmueble.findMany({
      where: {
        copropiedadId,
        deletedAt: null,
        copropiedad: {
          administradores: {
            some: { usuarioId: administradorId, deletedAt: null },
          },
        },
      },
      orderBy: { identificador: "asc" },
      select: {
        id: true,
        identificador: true,
        coeficiente: true,
        areaM2: true,
        estado: true,
        residentes: {
          where: { activo: true, deletedAt: null },
          select: {
            rol: true,
            usuario: { select: { nombre: true } },
          },
        },
      },
    });
  }
);

export type InmuebleConResidentes = Awaited<
  ReturnType<typeof getInmueblesPorCopropiedad>
>[number];

/** Conteo de inmuebles por estado, para todas las copropiedades del administrador. */
export const getResumenInmuebles = cache(async (administradorId: string) => {
  const inmuebles = await prisma.inmueble.findMany({
    where: {
      deletedAt: null,
      copropiedad: {
        administradores: {
          some: { usuarioId: administradorId, deletedAt: null },
        },
      },
    },
    select: { estado: true },
  });

  return {
    total: inmuebles.length,
    ocupados: inmuebles.filter((i) => i.estado === "OCUPADO").length,
    desocupados: inmuebles.filter((i) => i.estado === "DESOCUPADO").length,
  };
});
