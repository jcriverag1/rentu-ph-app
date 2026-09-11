"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdministradorActual } from "@/lib/session";
import type { EstadoAccionFormulario } from "@/lib/types/estado-accion";

export type EstadoAccionPropiedad = EstadoAccionFormulario;

const toggleSchema = z.object({
  inmuebleId: z.uuid("Inmueble inválido"),
  disponibleArriendo: z.enum(["true", "false"]).transform((valor) => valor === "true"),
});

/** Publica o despublica un inmueble del marketplace público (`/propiedades`). */
export async function actualizarDisponibilidadInmueble(
  _prevState: EstadoAccionPropiedad,
  formData: FormData
): Promise<EstadoAccionPropiedad> {
  const validado = toggleSchema.safeParse({
    inmuebleId: formData.get("inmuebleId"),
    disponibleArriendo: formData.get("disponibleArriendo"),
  });

  if (!validado.success) {
    return { status: "error", message: "Solicitud inválida." };
  }

  const { inmuebleId, disponibleArriendo } = validado.data;

  try {
    const administrador = await getAdministradorActual();

    const inmueble = await prisma.inmueble.findFirst({
      where: {
        id: inmuebleId,
        deletedAt: null,
        copropiedad: {
          administradores: { some: { usuarioId: administrador.id, deletedAt: null } },
        },
      },
      select: { id: true },
    });

    if (!inmueble) {
      return { status: "error", message: "El inmueble no existe o no tienes acceso a él." };
    }

    await prisma.inmueble.update({
      where: { id: inmuebleId },
      data: { disponibleArriendo },
    });

    revalidatePath("/dashboard/propiedades");
    revalidatePath("/propiedades");

    return {
      status: "success",
      message: disponibleArriendo
        ? "Publicado en el marketplace."
        : "Despublicado del marketplace.",
    };
  } catch (error) {
    console.error("actualizarDisponibilidadInmueble", error);
    return { status: "error", message: "No se pudo actualizar la publicación." };
  }
}
