"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import {
  registrarPago,
  registrarPagoTotalDesdeFormulario,
  estadoInicialAccionPago,
} from "@/lib/actions/pagos";
import { METODOS_PAGO } from "@/lib/validations/pagos";

function BotonAbonar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? "Registrando…" : "Abonar"}
    </button>
  );
}

function BotonPagarTodo() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {pending ? "…" : "Pagar todo"}
    </button>
  );
}

export function RegistrarPagoForm({
  cuentaDeCobroId,
  saldoPendiente,
}: {
  cuentaDeCobroId: string;
  saldoPendiente: string;
}) {
  const montoId = useId();
  const [estadoAbono, accionAbono] = useActionState(
    registrarPago,
    estadoInicialAccionPago
  );
  const [estadoTotal, accionTotal] = useActionState(
    registrarPagoTotalDesdeFormulario,
    estadoInicialAccionPago
  );

  const estado = estadoAbono.status !== "idle" ? estadoAbono : estadoTotal;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <form action={accionAbono} className="flex items-center gap-1.5">
          <input type="hidden" name="cuentaDeCobroId" value={cuentaDeCobroId} />
          <input type="hidden" name="metodo" value={METODOS_PAGO[0]} />
          <label htmlFor={montoId} className="sr-only">
            Monto a abonar
          </label>
          <input
            id={montoId}
            name="monto"
            type="text"
            inputMode="decimal"
            placeholder={saldoPendiente}
            className="w-28 rounded-md border border-zinc-300 px-2 py-1.5 text-xs tabular-nums focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
          <BotonAbonar />
        </form>
        <form action={accionTotal}>
          <input type="hidden" name="cuentaDeCobroId" value={cuentaDeCobroId} />
          <BotonPagarTodo />
        </form>
      </div>
      {estado.status === "error" ? (
        <p className="text-xs text-red-600">
          {estado.errores?.monto?.[0] ?? estado.message}
        </p>
      ) : null}
      {estado.status === "success" ? (
        <p className="text-xs text-emerald-600">{estado.message}</p>
      ) : null}
    </div>
  );
}
