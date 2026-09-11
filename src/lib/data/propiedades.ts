import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type FiltrosMarketplace = {
  precioMax?: number;
  copropiedadId?: string;
  habitacionesMin?: number;
};

/**
 * Catálogo público del marketplace — sin autenticación, cualquiera puede
 * consultarlo. Solo trae inmuebles marcados `disponibleArriendo` con un
 * canon definido (evita publicar filas a medio llenar).
 */
export async function getPropiedadesDisponibles(filtros: FiltrosMarketplace = {}) {
  return prisma.inmueble.findMany({
    where: {
      deletedAt: null,
      disponibleArriendo: true,
      canonArriendo: {
        not: null,
        ...(filtros.precioMax ? { lte: filtros.precioMax } : {}),
      },
      ...(filtros.copropiedadId ? { copropiedadId: filtros.copropiedadId } : {}),
      ...(filtros.habitacionesMin
        ? { habitaciones: { gte: filtros.habitacionesMin } }
        : {}),
    },
    orderBy: { canonArriendo: "asc" },
    select: {
      id: true,
      identificador: true,
      canonArriendo: true,
      habitaciones: true,
      banos: true,
      areaM2: true,
      descripcionArriendo: true,
      imagenUrl: true,
      copropiedad: { select: { id: true, nombre: true, ciudad: true } },
    },
  });
}

export type PropiedadMarketplace = Awaited<
  ReturnType<typeof getPropiedadesDisponibles>
>[number];

/** Copropiedades con al menos un inmueble publicado — para el select del filtro. */
export const getCopropiedadesConPublicaciones = cache(async () => {
  return prisma.copropiedad.findMany({
    where: {
      deletedAt: null,
      inmuebles: { some: { disponibleArriendo: true, deletedAt: null } },
    },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
});

/** Todos los inmuebles administrados, para el panel de gestión del marketplace en /dashboard. */
export const getInmueblesDelAdministradorParaMarketplace = cache(
  async (administradorId: string) => {
    return prisma.inmueble.findMany({
      where: {
        deletedAt: null,
        copropiedad: {
          administradores: { some: { usuarioId: administradorId, deletedAt: null } },
        },
      },
      orderBy: [{ copropiedad: { nombre: "asc" } }, { identificador: "asc" }],
      select: {
        id: true,
        identificador: true,
        estado: true,
        disponibleArriendo: true,
        canonArriendo: true,
        habitaciones: true,
        banos: true,
        areaM2: true,
        imagenUrl: true,
        copropiedad: { select: { nombre: true } },
      },
    });
  }
);

export type InmuebleParaMarketplace = Awaited<
  ReturnType<typeof getInmueblesDelAdministradorParaMarketplace>
>[number];
