"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
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

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(validado.data);

  if (error) {
    // DIAGNÓSTICO TEMPORAL — revertir después de confirmar la env var.
    return {
      status: "error",
      message: `Correo o contraseña incorrectos. [debug url=${process.env.NEXT_PUBLIC_SUPABASE_URL} anonLen=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length} err=${error.message}]`,
    };
  }

  const destino = formData.get("next");
  redirect(typeof destino === "string" && destino.startsWith("/") ? destino : "/dashboard");
}

export async function cerrarSesion() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
