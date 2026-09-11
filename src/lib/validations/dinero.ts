import { z } from "zod";

/**
 * Los montos viajan como texto (FormData) y se validan con esta regex en
 * lugar de `z.coerce.number()` para no perder precisión antes de construir
 * un `Prisma.Decimal` — ver la nota de arquitectura en `schema.prisma`
 * ("Montos y coeficientes usan Decimal, nunca Float").
 */
export const montoDecimalSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Ingresa un monto válido, ej. 150000 o 150000.50")
  .refine((valor) => Number(valor) > 0, "El monto debe ser mayor a 0");

export const montoDecimalOpcionalSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Ingresa un monto válido, ej. 150000 o 150000.50")
  .optional()
  .transform((valor) => valor ?? "0");
