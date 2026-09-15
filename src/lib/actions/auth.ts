"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { RolUsuario } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EstadoAccionFormulario } from "@/lib/types/estado-accion";

export type EstadoAccionLogin = EstadoAccionFormulario;

const loginSchema = z.object({
  email: z.email("Ingresa un correo válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export async function iniciarSesion(
  _prevState: EstadoAccionLogin,
  formData: FormData
): Promise<EstadoAccionLogin> {
  const validado = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validado.success) {
    return { status: "error", message: "Ingresa un correo y contraseña válidos." };
  }

  // `redirect()` lanza una señal interna (NEXT_REDIRECT) que un catch de
  // más arriba interceptaría por error — por eso se llama SIEMPRE fuera del
  // try/catch, calculando el destino adentro.
  let destino = "/dashboard";

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(validado.data);

    if (error) {
      return { status: "error", message: "Correo o contraseña incorrectos." };
    }

    const usuario = await prisma.usuario.findFirst({
      where: { email: validado.data.email, deletedAt: null },
      select: { rol: true },
    });
    destino = usuario?.rol === RolUsuario.ADMINISTRADOR ? "/dashboard" : "/portal";

    const destinoParam = formData.get("next");
    if (typeof destinoParam === "string" && destinoParam.startsWith("/")) {
      destino = destinoParam;
    }
  } catch (error) {
    console.error("iniciarSesion", error);
    return {
      status: "error",
      message: "No se pudo iniciar sesión. Intenta de nuevo en un momento.",
    };
  }

  redirect(destino);
}

export async function cerrarSesion() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("cerrarSesion", error);
  }
  redirect("/login");
}
