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
 * Zonas comunes activas de la copropiedad del residente, para elegir al
 * radicar una reserva. `costo` se convierte a `number` porque un `Decimal`
 * de Prisma no es un objeto plano y Next.js no permite pasarlo de un Server
 * Component a un Client Component (este resultado alimenta
 * `<CrearReservaForm>` en `src/app/portal/reservas/page.tsx`).
 */
export const getZonasComunesDeCopropiedad = cache(async (copropiedadId: string) => {
  const zonas = await prisma.zonaComun.findMany({
    where: { copropiedadId, deletedAt: null, activa: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true, descripcion: true, aforo: true, costo: true },
  });

  return zonas.map((zona) => ({ ...zona, costo: Number(zona.costo) }));
});

export type ZonaComunParaResidente = Awaited<
  ReturnType<typeof getZonasComunesDeCopropiedad>
>[number];

/** Reservas propias de un inmueble, para la vista "Mis reservas" del residente. */
export const getReservasDeResidente = cache(async (inmuebleId: string) => {
  return prisma.reserva.findMany({
    where: { inmuebleId, deletedAt: null },
    orderBy: { fechaInicio: "desc" },
    select: {
      id: true,
      fechaInicio: true,
      fechaFin: true,
      estado: true,
      observaciones: true,
      createdAt: true,
      zonaComun: { select: { nombre: true } },
    },
  });
});

export type ReservaDeResidente = Awaited<ReturnType<typeof getReservasDeResidente>>[number];

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
