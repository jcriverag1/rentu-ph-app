import { z } from "zod";
import { TipoPQRS, EstadoPQRS } from "@prisma/client";

/** Usado por el Administrador: radica una PQRS dirigida hacia un residente concreto. */
export const crearPqrsSchema = z.object({
  inmuebleId: z.uuid("Inmueble inválido"),
  dirigidoAId: z.uuid("Selecciona hacia quién va dirigida la PQRS"),
  tipo: z.enum(TipoPQRS),
  titulo: z.string().trim().min(3, "Escribe un título").max(200, "Máximo 200 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(10, "Describe la situación (mínimo 10 caracteres)")
    .max(4000, "Máximo 4000 caracteres"),
});

/** Usado por el residente: radica su propia PQRS. `inmuebleId`/`radicadoPorId` se derivan de su sesión. */
export const crearPqrsResidenteSchema = z.object({
  tipo: z.enum(TipoPQRS),
  titulo: z.string().trim().min(3, "Escribe un título").max(200, "Máximo 200 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(10, "Describe la situación (mínimo 10 caracteres)")
    .max(4000, "Máximo 4000 caracteres"),
});

export const responderPqrsSchema = z.object({
  pqrsId: z.uuid("PQRS inválida"),
  estado: z.enum(EstadoPQRS),
  respuesta: z
    .string()
    .trim()
    .max(4000, "Máximo 4000 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CrearPqrsInput = z.infer<typeof crearPqrsSchema>;
export type CrearPqrsResidenteInput = z.infer<typeof crearPqrsResidenteSchema>;
export type ResponderPqrsInput = z.infer<typeof responderPqrsSchema>;
