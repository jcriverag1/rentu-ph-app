import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Copropiedades administradas por un Administrador, con conteos agregados
 * de inmuebles y cuentas de cobro pendientes/en mora para las tarjetas del
 * dashboard.
 */
export const getCopropiedadesDelAdministrador = cache(
  async (administradorId: string) => {
    const copropiedades = await prisma.copropiedad.findMany({
      where: {
        deletedAt: null,
        administradores: {
          some: { usuarioId: administradorId, deletedAt: null },
        },
      },
      orderBy: { nombre: "asc" },
      include: {
        _count: {
          select: { inmuebles: { where: { deletedAt: null } } },
        },
        inmuebles: {
          where: { deletedAt: null },
          select: {
            cuentasDeCobro: {
              where: {
                deletedAt: null,
                estado: { in: ["PENDIENTE", "VENCIDA", "EN_MORA"] },
              },
              select: { id: true },
            },
          },
        },
      },
    });

    return copropiedades.map((copropiedad) => {
      const cuentasPorCobrar = copropiedad.inmuebles.reduce(
        (total, inmueble) => total + inmueble.cuentasDeCobro.length,
        0
      );

      return {
        id: copropiedad.id,
        nombre: copropiedad.nombre,
        nit: copropiedad.nit,
        direccion: copropiedad.direccion,
        ciudad: copropiedad.ciudad,
        totalInmuebles: copropiedad._count.inmuebles,
        cuentasPorCobrar,
      };
    });
  }
);

export type CopropiedadResumen = Awaited<
  ReturnType<typeof getCopropiedadesDelAdministrador>
>[number];

export async function getCopropiedadPorId(
  copropiedadId: string,
  administradorId: string
) {
  return prisma.copropiedad.findFirst({
    where: {
      id: copropiedadId,
      deletedAt: null,
      administradores: {
        some: { usuarioId: administradorId, deletedAt: null },
      },
    },
  });
}
