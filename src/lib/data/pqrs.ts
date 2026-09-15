import { cache } from "react";
import { EstadoPQRS } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getPqrsDeAdministrador = cache(
  async (administradorId: string, estado?: EstadoPQRS) => {
    return prisma.pqrs.findMany({
      where: {
        deletedAt: null,
        ...(estado ? { estado } : {}),
        inmueble: {
          copropiedad: {
            administradores: { some: { usuarioId: administradorId, deletedAt: null } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        codigoRadicado: true,
        tipo: true,
        titulo: true,
        descripcion: true,
        estado: true,
        urlFoto: true,
        respuestaAdmin: true,
        respondidoEn: true,
        fechaCierre: true,
        createdAt: true,
        inmueble: {
          select: {
            identificador: true,
            copropiedad: { select: { nombre: true } },
          },
        },
        radicadoPor: { select: { nombre: true } },
        dirigidoA: { select: { nombre: true } },
      },
    });
  }
);

export type PqrsConDetalle = Awaited<ReturnType<typeof getPqrsDeAdministrador>>[number];

/** PQRS propias del residente: las que él mismo radicó y las que el Administrador dirigió hacia él. */
export const getPqrsDeResidente = cache(async (usuarioId: string, inmuebleId: string) => {
  return prisma.pqrs.findMany({
    where: {
      deletedAt: null,
      inmuebleId,
      OR: [{ radicadoPorId: usuarioId }, { dirigidoAId: usuarioId }],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      codigoRadicado: true,
      tipo: true,
      titulo: true,
      descripcion: true,
      estado: true,
      respuestaAdmin: true,
      respondidoEn: true,
      createdAt: true,
      radicadoPorId: true,
      dirigidoAId: true,
      radicadoPor: { select: { nombre: true } },
    },
  });
});

export type PqrsDeResidente = Awaited<ReturnType<typeof getPqrsDeResidente>>[number];

/** Conteo de PQRS por estado, para las tarjetas de KPI y las pestañas de filtro. */
export const getResumenPqrs = cache(async (administradorId: string) => {
  const filas = await prisma.pqrs.groupBy({
    by: ["estado"],
    where: {
      deletedAt: null,
      inmueble: {
        copropiedad: {
          administradores: { some: { usuarioId: administradorId, deletedAt: null } },
        },
      },
    },
    _count: { _all: true },
  });

  const conteos: Record<EstadoPQRS, number> = {
    ABIERTO: 0,
    EN_PROCESO: 0,
    CERRADO: 0,
  };
  for (const fila of filas) conteos[fila.estado] = fila._count._all;

  return {
    ...conteos,
    total: conteos.ABIERTO + conteos.EN_PROCESO + conteos.CERRADO,
  };
});

/**
 * Estructura anidada (copropiedad → inmuebles → residentes activos) para el
 * formulario de radicar PQRS: permite selects en cascada 100% en el cliente,
 * sin round-trips adicionales al servidor.
 */
export const getCopropiedadesConInmueblesParaPqrs = cache(
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
          select: {
            id: true,
            identificador: true,
            residentes: {
              where: { activo: true, deletedAt: null },
              select: {
                usuarioId: true,
                usuario: { select: { nombre: true } },
              },
            },
          },
        },
      },
    });
  }
);

export type CopropiedadParaPqrs = Awaited<
  ReturnType<typeof getCopropiedadesConInmueblesParaPqrs>
>[number];
