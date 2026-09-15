import { cache } from "react";
import { prisma } from "@/lib/prisma";

/** Residentes activos vinculados a inmuebles de las copropiedades del administrador. */
export const getResidentesDeAdministrador = cache(async (administradorId: string) => {
  return prisma.usuarioInmueble.findMany({
    where: {
      deletedAt: null,
      activo: true,
      inmueble: {
        deletedAt: null,
        copropiedad: {
          administradores: { some: { usuarioId: administradorId, deletedAt: null } },
        },
      },
    },
    orderBy: [
      { inmueble: { copropiedad: { nombre: "asc" } } },
      { inmueble: { identificador: "asc" } },
    ],
    select: {
      id: true,
      rol: true,
      fechaInicio: true,
      usuario: { select: { id: true, nombre: true, email: true, telefono: true } },
      inmueble: {
        select: {
          identificador: true,
          copropiedad: { select: { nombre: true } },
        },
      },
    },
  });
});

export type ResidenteConDetalle = Awaited<ReturnType<typeof getResidentesDeAdministrador>>[number];

/**
 * Estructura anidada (copropiedad → inmuebles) para el formulario de
 * invitar residente: permite un select en cascada 100% en el cliente.
 */
export const getCopropiedadesConInmueblesParaInvitar = cache(
  async (administradorId: string) => {
    return prisma.copropiedad.findMany({
      where: {
        deletedAt: null,
        administradores: { some: { usuarioId: administradorId, deletedAt: null } },
      },
      orderBy: { nombre: "asc" },
      select: {
        id: true,
        nombre: true,
        inmuebles: {
          where: { deletedAt: null },
          orderBy: { identificador: "asc" },
          select: { id: true, identificador: true },
        },
      },
    });
  }
);

export type CopropiedadParaInvitar = Awaited<
  ReturnType<typeof getCopropiedadesConInmueblesParaInvitar>
>[number];
