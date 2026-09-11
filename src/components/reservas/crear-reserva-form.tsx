"use client";

import { useActionState, useId, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { crearReserva, estadoInicialAccionReserva } from "@/lib/actions/reservas";
import type { CopropiedadParaReservas } from "@/lib/data/reservas";

function BotonRadicar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? "Radicando…" : "Radicar reserva"}
    </button>
  );
}

export function CrearReservaForm({
  copropiedades,
}: {
  copropiedades: CopropiedadParaReservas[];
}) {
  const [estado, accion] = useActionState(crearReserva, estadoInicialAccionReserva);

  const [copropiedadId, setCopropiedadId] = useState(copropiedades[0]?.id ?? "");
  const copropiedad = copropiedades.find((c) => c.id === copropiedadId);

  const [inmuebleId, setInmuebleId] = useState(copropiedad?.inmuebles[0]?.id ?? "");
  const inmueble = useMemo(
    () => copropiedad?.inmuebles.find((i) => i.id === inmuebleId),
    [copropiedad, inmuebleId]
  );

  const idCopropiedad = useId();
  const idZona = useId();
  const idInmueble = useId();
  const idResidente = useId();
  const idInicio = useId();
  const idFin = useId();
  const idObservaciones = useId();

  if (copropiedades.length === 0) return null;

  function alCambiarCopropiedad(id: string) {
    setCopropiedadId(id);
    const nueva = copropiedades.find((c) => c.id === id);
    setInmuebleId(nueva?.inmuebles[0]?.id ?? "");
  }

  const sinZonas = (copropiedad?.zonasComunes.length ?? 0) === 0;

  return (
    <form
      action={accion}
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Radicar reserva</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Queda como pendiente hasta que la apruebes en la agenda de abajo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label htmlFor={idCopropiedad} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Copropiedad
          </label>
          <select
            id={idCopropiedad}
            value={copropiedadId}
            onChange={(evento) => alCambiarCopropiedad(evento.target.value)}
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            {copropiedades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={idZona} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Zona común
          </label>
          {sinZonas ? (
            <p className="rounded-md border border-dashed border-zinc-300 px-2 py-1.5 text-xs text-zinc-400 dark:border-zinc-700">
              Crea primero una zona común activa.
            </p>
          ) : (
            <select
              id={idZona}
              name="zonaComunId"
              required
              className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            >
              {copropiedad?.zonasComunes.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={idInmueble} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Inmueble
          </label>
          <select
            id={idInmueble}
            name="inmuebleId"
            required
            value={inmuebleId}
            onChange={(evento) => setInmuebleId(evento.target.value)}
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            {(copropiedad?.inmuebles ?? []).map((i) => (
              <option key={i.id} value={i.id}>
                {i.identificador}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={idResidente} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Solicitado por
          </label>
          {inmueble && inmueble.residentes.length > 0 ? (
            <select
              id={idResidente}
              name="solicitadaPorId"
              required
              className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            >
              {inmueble.residentes.map((r) => (
                <option key={r.usuarioId} value={r.usuarioId}>
                  {r.usuario.nombre}
                </option>
              ))}
            </select>
          ) : (
            <p className="rounded-md border border-dashed border-zinc-300 px-2 py-1.5 text-xs text-zinc-400 dark:border-zinc-700">
              Sin residentes activos.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={idInicio} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Fecha y hora de inicio
          </label>
          <input
            id={idInicio}
            name="fechaInicio"
            type="datetime-local"
            required
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
          {estado.errores?.fechaInicio?.[0] ? (
            <p className="text-xs text-red-600">{estado.errores.fechaInicio[0]}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={idFin} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Fecha y hora de fin
          </label>
          <input
            id={idFin}
            name="fechaFin"
            type="datetime-local"
            required
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
          {estado.errores?.fechaFin?.[0] ? (
            <p className="text-xs text-red-600">{estado.errores.fechaFin[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={idObservaciones} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Observaciones (opcional)
        </label>
        <input
          id={idObservaciones}
          name="observaciones"
          type="text"
          placeholder="ej. Celebración de cumpleaños, 20 personas"
          className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div className="flex items-center gap-4">
        <BotonRadicar />
        {estado.status === "error" ? (
          <p className="text-sm text-red-600">{estado.message}</p>
        ) : null}
        {estado.status === "success" ? (
          <p className="text-sm text-emerald-600">{estado.message}</p>
        ) : null}
      </div>
    </form>
  );
}
