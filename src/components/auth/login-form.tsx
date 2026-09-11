"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { iniciarSesion, estadoInicialAccionLogin } from "@/lib/actions/auth";

function BotonIngresar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? "Ingresando…" : "Ingresar"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [estado, accion] = useActionState(iniciarSesion, estadoInicialAccionLogin);
  const emailId = useId();
  const passwordId = useId();

  return (
    <form action={accion} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />

      <div className="flex flex-col gap-1">
        <label htmlFor={emailId} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Correo
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@copropiedad.com"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={passwordId} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Contraseña
        </label>
        <input
          id={passwordId}
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      {estado.status === "error" ? (
        <p className="text-sm text-red-600">{estado.message}</p>
      ) : null}

      <BotonIngresar />
    </form>
  );
}
