/**
 * Un archivo con directiva `"use server"` SOLO puede exportar funciones
 * async — cualquier otro export (una constante, un objeto) hace que Next.js
 * falle en runtime con "A 'use server' file can only export async
 * functions, found object.". Por eso el estado inicial de `useActionState`
 * vive en este módulo aparte (sin `"use server"`), no en `src/lib/actions/*`.
 */
export type EstadoAccionFormulario = {
  status: "idle" | "error" | "success";
  message?: string;
  errores?: Record<string, string[] | undefined>;
};

export const ESTADO_INICIAL_ACCION: EstadoAccionFormulario = { status: "idle" };
