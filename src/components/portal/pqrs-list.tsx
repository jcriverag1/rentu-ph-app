import type { PqrsDeResidente } from "@/lib/data/pqrs";
import { EstadoPqrsBadge } from "@/components/pqrs/estado-pqrs-badge";
import { formatearFecha } from "@/lib/formatters";

const ETIQUETAS_TIPO: Record<string, string> = {
  PETICION: "Petición",
  QUEJA: "Queja",
  RECLAMO: "Reclamo",
  SUGERENCIA: "Sugerencia",
  FALLA: "Falla",
};

export function PqrsList({ items, usuarioId }: { items: PqrsDeResidente[]; usuarioId: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">Todavía no tienes ninguna PQRS.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((pqrs) => {
        const dirigidaHaciaTi = pqrs.dirigidoAId === usuarioId && pqrs.radicadoPorId !== usuarioId;

        return (
          <li
            key={pqrs.id}
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-mono text-zinc-400">{pqrs.codigoRadicado}</p>
                <h3 className="font-semibold text-zinc-900">{pqrs.titulo}</h3>
                <p className="text-xs text-zinc-500">
                  {ETIQUETAS_TIPO[pqrs.tipo] ?? pqrs.tipo} ·{" "}
                  {dirigidaHaciaTi
                    ? "dirigida a ti por el administrador"
                    : `radicada por ${pqrs.radicadoPor.nombre}`}{" "}
                  · {formatearFecha(pqrs.createdAt)}
                </p>
              </div>
              <EstadoPqrsBadge estado={pqrs.estado} />
            </div>

            <p className="text-sm text-zinc-700">{pqrs.descripcion}</p>

            {pqrs.respuestaAdmin ? (
              <div className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
                <p className="text-xs font-medium text-zinc-500">
                  Respuesta del Administrador
                  {pqrs.respondidoEn ? ` · ${formatearFecha(pqrs.respondidoEn)}` : ""}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{pqrs.respuestaAdmin}</p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
