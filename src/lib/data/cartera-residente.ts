import { cache } from "react";
import { prisma } from "@/lib/prisma";

/** Cuentas de cobro de un inmueble, con sus pagos, para la vista de cartera del residente. */
export const getCuentasDeCobroDeResidente = cache(async (inmuebleId: string) => {
  return prisma.cuentaDeCobro.findMany({
    where: { inmuebleId, deletedAt: null },
    orderBy: { fechaEmision: "desc" },
    select: {
      id: true,
      periodo: true,
      totalAPagar: true,
      montoPagado: true,
      estado: true,
      fechaLimitePago: true,
      recargosMora: {
        where: { deletedAt: null },
        select: { monto: true, congelado: true },
      },
      pagos: {
        where: { deletedAt: null },
        orderBy: { fechaPago: "desc" },
        select: { id: true, monto: true, metodo: true, fechaPago: true },
      },
    },
  });
});

export type CuentaDeCobroResidente = Awaited<
  ReturnType<typeof getCuentasDeCobroDeResidente>
>[number];
