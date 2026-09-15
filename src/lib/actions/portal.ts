"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_INMUEBLE_ACTIVO } from "@/lib/session";

/**
 * Cambia cuál de los inmuebles vinculados del residente está activo (solo
 * relevante si tiene más de uno). No hace falta validar que `inmuebleId`
 * sea realmente suyo: `getResidenteActual()` solo usa el valor de la
 * cookie para elegir entre sus propios vínculos activos, y cae al primero
 * si no coincide con ninguno — no hay forma de leer datos ajenos por esta vía.
 */
export async function seleccionarInmuebleActivo(formData: FormData) {
  const inmuebleId = formData.get("inmuebleId");

  if (typeof inmuebleId === "string" && inmuebleId) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_INMUEBLE_ACTIVO, inmuebleId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  redirect("/portal");
}
