import { cache } from "react";
import { EstadoCuenta } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ESTADOS_POR_COBRAR: EstadoCuenta[] = [
  EstadoCuenta.PENDIENTE,
  EstadoCuenta.VENCIDA,
  EstadoCuenta.EN_MORA,
];

/** Cuentas de cobro más recientes de todas las copropiedades del administrador. */
export const getCuentasDeCobroRecientes = cache(
  async (administradorId: string, limite = 8) => {
    return prisma.cuentaDeCobro.findMany({
      where: {
        deletedAt: null,
        inmueble: {
          deletedAt: null,
          copropiedad: {
            administradores: {
              some: { usuarioId: administradorId, deletedAt: null },
            },
          },
        },
      },
      orderBy: { fechaEmision: "desc" },
      take: limite,
      select: {
        id: true,
        periodo: true,
        totalAPagar: true,
        estado: true,
        fechaLimitePago: true,
        inmueble: {
          select: {
            identificador: true,
            copropiedad: { select: { nombre: true } },
          },
        },
        recargosMora: {
          where: { deletedAt: null },
          select: { monto: true, congelado: true },
        },
      },
    });
  }
);

export type CuentaDeCobroReciente = Awaited<
  ReturnType<typeof getCuentasDeCobroRecientes>
>[number];

/** Totales de cartera (por cobrar / en mora) para las tarjetas de KPI. */
export const getResumenCartera = cache(async (administradorId: string) => {
  const cuentas = await prisma.cuentaDeCobro.findMany({
    where: {
      deletedAt: null,
      estado: { in: ESTADOS_POR_COBRAR },
      inmueble: {
        deletedAt: null,
        copropiedad: {
          administradores: {
            some: { usuarioId: administradorId, deletedAt: null },
          },
        },
      },
    },
    select: { estado: true, totalAPagar: true },
  });

  const totalPorCobrar = cuentas.reduce(
    (suma, cuenta) => suma + Number(cuenta.totalAPagar),
    0
  );
  const cuentasEnMora = cuentas.filter(
    (cuenta) => cuenta.estado === EstadoCuenta.EN_MORA
  );

  return {
    cantidadPorCobrar: cuentas.length,
    totalPorCobrar,
    cantidadEnMora: cuentasEnMora.length,
    totalEnMora: cuentasEnMora.reduce(
      (suma, cuenta) => suma + Number(cuenta.totalAPagar),
      0
    ),
  };
});
