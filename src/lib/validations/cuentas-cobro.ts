import { z } from "zod";
import {
  montoDecimalOpcionalSchema,
  montoDecimalSchema,
} from "@/lib/validations/dinero";

const PERIODO_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const generarCuentasDeCobroSchema = z.object({
  copropiedadId: z.uuid("Copropiedad inválida"),
  periodo: z
    .string()
    .trim()
    .regex(PERIODO_REGEX, "Formato de periodo inválido (usa AAAA-MM)"),
  montoAdministracionTotal: montoDecimalSchema,
  montoExpensasPorInmueble: montoDecimalOpcionalSchema,
  fechaLimitePago: z
    .string()
    .refine((valor) => !Number.isNaN(Date.parse(valor)), "Fecha límite inválida"),
});

export type GenerarCuentasDeCobroInput = z.infer<
  typeof generarCuentasDeCobroSchema
>;
