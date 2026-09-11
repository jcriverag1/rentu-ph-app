"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { indexarDocumento } from "@/lib/actions/documentos";
import { ESTADO_INICIAL_ACCION } from "@/lib/types/estado-accion";

const TIPOS_DOCUMENTO = [
  { value: "REGLAMENTO_PH", label: "Reglamento de PH" },
  { value: "MANUAL_CONVIVENCIA", label: "Manual de convivencia" },
  { value: "ACTA_ASAMBLEA", label: "Acta de asamblea" },
  { value: "OTRO", label: "Otro" },
] as const;

function BotonIndexar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? "Indexando… (puede tardar la primera vez)" : "Indexar documento"}
    </button>
  );
}

export function SubirDocumentoForm({
  copropiedades,
}: {
  copropiedades: { id: string; nombre: string }[];
}) {
  const [estado, accion] = useActionState(
    indexarDocumento,
    ESTADO_INICIAL_ACCION
  );
  const idCopropiedad = useId();
  const idTipo = useId();
  const idTitulo = useId();
  const idContenido = useId();

  if (copropiedades.length === 0) return null;

  return (
    <form
      action={accion}
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          Indexar documento de la copropiedad
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Pega el texto del reglamento, manual de convivencia o acta. Se
          trocea y se indexa con un modelo de embeddings local (sin costo)
          para que el Copiloto pueda responder preguntas sobre él.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={idCopropiedad} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Copropiedad
          </label>
          <select
            id={idCopropiedad}
            name="copropiedadId"
            required
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            {copropiedades.map((copropiedad) => (
              <option key={copropiedad.id} value={copropiedad.id}>
                {copropiedad.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={idTipo} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Tipo de documento
          </label>
          <select
            id={idTipo}
            name="tipo"
            required
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            {TIPOS_DOCUMENTO.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={idTitulo} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Título
        </label>
        <input
          id={idTitulo}
          name="titulo"
          type="text"
          required
          placeholder="ej. Reglamento de Propiedad Horizontal 2026"
          className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
        {estado.errores?.titulo?.[0] ? (
          <p className="text-xs text-red-600">{estado.errores.titulo[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={idContenido} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Contenido
        </label>
        <textarea
          id={idContenido}
          name="contenido"
          required
          rows={6}
          placeholder="Pega aquí el texto completo del documento…"
          className="w-full resize-y rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        />
        {estado.errores?.contenido?.[0] ? (
          <p className="text-xs text-red-600">{estado.errores.contenido[0]}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        <BotonIndexar />
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
