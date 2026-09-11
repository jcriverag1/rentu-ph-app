"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { EstadoReserva, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdministradorActual } from "@/lib/session";
import {
  existeCruceDeHorario,
  inmuebleEstaEnMora,
} from "@/lib/data/reservas";
import {
  actualizarEstadoReservaSchema,
  crearReservaSchema,
  crearZonaComunSchema,
} from "@/lib/validations/reservas";
import type { EstadoAccionFormulario } from "@/lib/types/estado-accion";

export type EstadoAccionReserva = EstadoAccionFormulario;

export async function crearZonaComun(
  _prevState: EstadoAccionReserva,
  formData: FormData
): Promise<EstadoAccionReserva> {
  const validado = crearZonaComunSchema.safeParse({
    copropiedadId: formData.get("copropiedadId"),
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion") ?? "",
    aforo: formData.get("aforo"),
    costo: formData.get("costo") ?? "0",
  });

  if (!validado.success) {
    return {
      status: "error",
      message: "Revisa los datos del formulario.",
      errores: z.flattenError(validado.error).fieldErrors,
    };
  }

  const { copropiedadId, nombre, descripcion, aforo, costo } = validado.data;

  try {
    const administrador = await getAdministradorActual();

    const copropiedad = await prisma.copropiedad.findFirst({
      where: {
        id: copropiedadId,
        deletedAt: null,
        administradores: { some: { usuarioId: administrador.id, deletedAt: null } },
      },
      select: { id: true },
    });

    if (!copropiedad) {
      return { status: "error", message: "La copropiedad no existe o no tienes acceso a ella." };
    }

    await prisma.zonaComun.create({
      data: {
        copropiedadId,
        nombre,
        descripcion: descripcion || null,
        aforo,
        costo: new Prisma.Decimal(costo),
      },
    });

    revalidatePath("/dashboard/reservas");

    return { status: "success", message: `"${nombre}" creada.` };
  } catch (error) {
    console.error("crearZonaComun", error);
    return { status: "error", message: "No se pudo crear la zona común." };
  }
}

/** Radica una solicitud de reserva. Bloquea inmuebles en mora y cruces de horario. */
export async function crearReserva(
  _prevState: EstadoAccionReserva,
  formData: FormData
): Promise<EstadoAccionReserva> {
  const validado = crearReservaSchema.safeParse({
    zonaComunId: formData.get("zonaComunId"),
    inmuebleId: formData.get("inmuebleId"),
    solicitadaPorId: formData.get("solicitadaPorId"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
    observaciones: formData.get("observaciones") ?? "",
  });

  if (!validado.success) {
    return {
      status: "error",
      message: "Revisa los datos del formulario.",
      errores: z.flattenError(validado.error).fieldErrors,
    };
  }

  const { zonaComunId, inmuebleId, solicitadaPorId, fechaInicio, fechaFin, observaciones } =
    validado.data;

  try {
    const administrador = await getAdministradorActual();

    const zonaComun = await prisma.zonaComun.findFirst({
      where: {
        id: zonaComunId,
        deletedAt: null,
        activa: true,
        copropiedad: {
          administradores: { some: { usuarioId: administrador.id, deletedAt: null } },
          inmuebles: { some: { id: inmuebleId, deletedAt: null } },
        },
      },
      select: { id: true },
    });

    if (!zonaComun) {
      return {
        status: "error",
        message: "La zona común no existe, no está activa, o el inmueble no pertenece a esa copropiedad.",
      };
    }

    const residenteValido = await prisma.usuarioInmueble.findFirst({
      where: { inmuebleId, usuarioId: solicitadaPorId, activo: true, deletedAt: null },
      select: { id: true },
    });

    if (!residenteValido) {
      return {
        status: "error",
        message: "La persona seleccionada no es un residente activo de ese inmueble.",
      };
    }

    // Regla de negocio: un inmueble en mora no puede solicitar reservas.
    if (await inmuebleEstaEnMora(inmuebleId)) {
      return {
        status: "error",
        message: "Este inmueble tiene cuentas en mora. Debe estar a paz y salvo para solicitar una reserva.",
      };
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (await existeCruceDeHorario({ zonaComunId, fechaInicio: inicio, fechaFin: fin })) {
      return {
        status: "error",
        message: "Ya existe una reserva pendiente o confirmada que se cruza con ese horario.",
      };
    }

    await prisma.reserva.create({
      data: {
        zonaComunId,
        inmuebleId,
        solicitadaPorId,
        fechaInicio: inicio,
        fechaFin: fin,
        observaciones: observaciones || null,
      },
    });

    revalidatePath("/dashboard/reservas");

    return { status: "success", message: "Reserva radicada como pendiente de aprobación." };
  } catch (error) {
    console.error("crearReserva", error);
    return { status: "error", message: "No se pudo radicar la reserva." };
  }
}

/** Aprueba, cancela o vuelve a poner pendiente una reserva. */
export async function actualizarEstadoReserva(
  _prevState: EstadoAccionReserva,
  formData: FormData
): Promise<EstadoAccionReserva> {
  const validado = actualizarEstadoReservaSchema.safeParse({
    reservaId: formData.get("reservaId"),
    estado: formData.get("estado"),
  });

  if (!validado.success) {
    return {
      status: "error",
      message: "Revisa los datos del formulario.",
      errores: z.flattenError(validado.error).fieldErrors,
    };
  }

  const { reservaId, estado } = validado.data;

  try {
    const administrador = await getAdministradorActual();

    const reserva = await prisma.reserva.findFirst({
      where: {
        id: reservaId,
        deletedAt: null,
        zonaComun: {
          copropiedad: {
            administradores: { some: { usuarioId: administrador.id, deletedAt: null } },
          },
        },
      },
      select: { id: true, zonaComunId: true, inmuebleId: true, fechaInicio: true, fechaFin: true },
    });

    if (!reserva) {
      return { status: "error", message: "La reserva no existe o no tienes acceso a ella." };
    }

    if (estado === EstadoReserva.CONFIRMADA) {
      // La mora pudo aparecer después de radicada la solicitud: se revalida.
      if (await inmuebleEstaEnMora(reserva.inmuebleId)) {
        return {
          status: "error",
          message: "No se puede confirmar: el inmueble tiene cuentas en mora.",
        };
      }

      if (
        await existeCruceDeHorario({
          zonaComunId: reserva.zonaComunId,
          fechaInicio: reserva.fechaInicio,
          fechaFin: reserva.fechaFin,
          excluirReservaId: reserva.id,
        })
      ) {
        return {
          status: "error",
          message: "No se puede confirmar: ya hay otra reserva confirmada en ese horario.",
        };
      }
    }

    await prisma.reserva.update({ where: { id: reservaId }, data: { estado } });

    revalidatePath("/dashboard/reservas");

    return { status: "success", message: "Reserva actualizada." };
  } catch (error) {
    console.error("actualizarEstadoReserva", error);
    return { status: "error", message: "No se pudo actualizar la reserva." };
  }
}
