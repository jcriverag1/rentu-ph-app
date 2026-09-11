"use client";

import { useId, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

function TextoDeMensaje({ parts }: { parts: { type: string; text?: string }[] }) {
  const texto = parts
    .filter((parte) => parte.type === "text")
    .map((parte) => parte.text ?? "")
    .join("");
  return <p className="whitespace-pre-wrap">{texto}</p>;
}

function Conversacion({
  copropiedadId,
  nombreCopropiedad,
}: {
  copropiedadId: string;
  nombreCopropiedad: string;
}) {
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/copiloto",
        body: { copropiedadId },
      })
  );
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [entrada, setEntrada] = useState("");
  const inputId = useId();

  const cargando = status === "submitted" || status === "streaming";

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const texto = entrada.trim();
    if (!texto || cargando) return;
    sendMessage({ text: texto });
    setEntrada("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-80 flex-col gap-3 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        {messages.length === 0 ? (
          <p className="m-auto max-w-sm text-center text-sm text-zinc-400">
            Pregúntame algo sobre el reglamento, el manual de convivencia o
            las actas de asamblea de {nombreCopropiedad}.
          </p>
        ) : (
          messages.map((mensaje) => (
            <div
              key={mensaje.id}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                mensaje.role === "user"
                  ? "ml-auto bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "mr-auto bg-white text-zinc-800 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-800"
              }`}
            >
              <TextoDeMensaje parts={mensaje.parts} />
            </div>
          ))
        )}
        {cargando ? (
          <p className="mr-auto text-xs text-zinc-400">El Copiloto está escribiendo…</p>
        ) : null}
      </div>

      {status === "error" ? (
        <p className="text-xs text-red-600">
          {error?.message ?? "Ocurrió un error al consultar al Copiloto."}
        </p>
      ) : null}

      <form onSubmit={enviar} className="flex items-center gap-2">
        <label htmlFor={inputId} className="sr-only">
          Tu pregunta
        </label>
        <input
          id={inputId}
          type="text"
          value={entrada}
          onChange={(evento) => setEntrada(evento.target.value)}
          disabled={cargando}
          placeholder="ej. ¿Cuál es el horario permitido para música en zonas comunes?"
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="submit"
          disabled={cargando || !entrada.trim()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export function CopilotoChat({
  copropiedades,
}: {
  copropiedades: { id: string; nombre: string }[];
}) {
  const [copropiedadId, setCopropiedadId] = useState(copropiedades[0]?.id ?? "");
  const selectId = useId();

  if (copropiedades.length === 0) return null;

  const copropiedad = copropiedades.find((c) => c.id === copropiedadId) ?? copropiedades[0];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Copiloto Administrativo
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Responde con base en los documentos indexados de la copropiedad.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor={selectId} className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Copropiedad
          </label>
          <select
            id={selectId}
            value={copropiedadId}
            onChange={(evento) => setCopropiedadId(evento.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            {copropiedades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Conversacion key={copropiedad.id} copropiedadId={copropiedad.id} nombreCopropiedad={copropiedad.nombre} />
    </div>
  );
}
