import { cache } from "react";
import { EstadoCuenta, EstadoReserva } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getZonasComunesDeAdministrador = cache(async (administradorId: string) => {
  return prisma.zonaComun.findMany({
    where: {
      deletedAt: null,
      copropiedad: {
        administradores: { some: { usuarioId: administradorId, deletedAt: null } },
      },
    },
    orderBy: [{ copropiedad: { nombre: "asc" } }, { nombre: "asc" }],
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      aforo: true,
      costo: true,
      activa: true,
      copropiedad: { select: { nombre: true } },
      _count: {
        select: {
          reservas: {
            where: { deletedAt: null, estado: { not: EstadoReserva.CANCELADA } },
          },
        },
      },
    },
  });
});

export type ZonaComunResumen = Awaited<
  ReturnType<typeof getZonasComunesDeAdministrador>
>[number];

export const getReservasDeAdministrador = cache(
  async (administradorId: string, estado?: EstadoReserva) => {
    return prisma.reserva.findMany({
      where: {
        deletedAt: null,
        ...(estado ? { estado } : {}),
        zonaComun: {
          copropiedad: {
            administradores: { some: { usuarioId: administradorId, deletedAt: null } },
          },
        },
      },
      orderBy: { fechaInicio: "asc" },
      select: {
        id: true,
        fechaInicio: true,
        fechaFin: true,
        estado: true,
        observaciones: true,
        createdAt: true,
        zonaComun: {
          select: { nombre: true, copropiedad: { select: { nombre: true } } },
        },
        inmueble: { select: { identificador: true } },
        solicitadaPor: { select: { nombre: true } },
      },
    });
  }
);

export type ReservaConDetalle = Awaited<
  ReturnType<typeof getReservasDeAdministrador>
>[number];

/**
 * Estructura anidada para el formulario de reservas: cada copropiedad trae
 * sus zonas comunes activas y sus inmuebles con residentes activos, para
 * armar selects en cascada 100% en el cliente.
 */
export const getCopropiedadesParaReservas = cache(async (administradorId: string) => {
  return prisma.copropiedad.findMany({
    where: {
      deletedAt: null,
      administradores: { some: { usuarioId: administradorId, deletedAt: null } },
    },
    orderBy: { nombre: "asc" },
    select: {
      id: true,
      nombre: true,
      zonasComunes: {
        where: { deletedAt: null, activa: true },
        orderBy: { nombre: "asc" },
        select: { id: true, nombre: true },
      },
      inmuebles: {
        where: { deletedAt: null },
        orderBy: { identificador: "asc" },
        select: {
          id: true,
          identificador: true,
          residentes: {
            where: { activo: true, deletedAt: null },
            select: { usuarioId: true, usuario: { select: { nombre: true } } },
          },
        },
      },
    },
  });
});

export type CopropiedadParaReservas = Awaited<
  ReturnType<typeof getCopropiedadesParaReservas>
>[number];

/**
 * true si el inmueble tiene alguna cuenta de cobro VENCIDA o EN_MORA (no
 * está a paz y salvo). Ambos estados bloquean reservas — no solo la mora
 * ya escalada.
 */
export async function inmuebleNoEstaAPazYSalvo(inmuebleId: string): Promise<boolean> {
  const cuentaPendienteCritica = await prisma.cuentaDeCobro.findFirst({
    where: {
      inmuebleId,
      deletedAt: null,
      estado: { in: [EstadoCuenta.VENCIDA, EstadoCuenta.EN_MORA] },
    },
    select: { id: true },
  });
  return cuentaPendienteCritica !== null;
}

/** true si ya existe una reserva PENDIENTE/CONFIRMADA que se cruza en el tiempo. */
export async function existeCruceDeHorario(params: {
  zonaComunId: string;
  fechaInicio: Date;
  fechaFin: Date;
  excluirReservaId?: string;
}): Promise<boolean> {
  const cruce = await prisma.reserva.findFirst({
    where: {
      zonaComunId: params.zonaComunId,
      deletedAt: null,
      estado: { in: [EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA] },
      id: params.excluirReservaId ? { not: params.excluirReservaId } : undefined,
      fechaInicio: { lt: params.fechaFin },
      fechaFin: { gt: params.fechaInicio },
    },
    select: { id: true },
  });
  return cruce !== null;
}
