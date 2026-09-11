import { z } from "zod";
import { montoDecimalSchema } from "@/lib/validations/dinero";

export const METODOS_PAGO = [
  "Transferencia",
  "Consignación",
  "Efectivo",
  "PSE",
] as const;

export const registrarPagoSchema = z.object({
  cuentaDeCobroId: z.uuid("Cuenta de cobro inválida"),
  monto: montoDecimalSchema,
  metodo: z.enum(METODOS_PAGO).default("Transferencia"),
  observaciones: z
    .string()
    .trim()
    .max(500, "Máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type RegistrarPagoInput = z.infer<typeof registrarPagoSchema>;
