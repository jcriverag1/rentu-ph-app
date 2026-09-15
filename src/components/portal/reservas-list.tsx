import type { ReservaDeResidente } from "@/lib/data/reservas";
import { EstadoReservaBadge } from "@/components/reservas/estado-reserva-badge";
import { formatearFechaLarga, formatearHora } from "@/lib/formatters";

export function ReservasList({ reservas }: { reservas: ReservaDeResidente[] }) {
  if (reservas.length === 0) {
    return <p className="text-sm text-zinc-500">Todavía no tienes ninguna reserva.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {reservas.map((reserva) => (
        <li
          key={reserva.id}
          className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-zinc-900">
              {formatearFechaLarga(reserva.fechaInicio)} ·{" "}
              {formatearHora(reserva.fechaInicio)}–{formatearHora(reserva.fechaFin)} ·{" "}
              {reserva.zonaComun.nombre}
            </p>
            {reserva.observaciones ? (
              <p className="mt-1 text-xs text-zinc-500">&ldquo;{reserva.observaciones}&rdquo;</p>
            ) : null}
          </div>
          <EstadoReservaBadge estado={reserva.estado} />
        </li>
      ))}
    </ul>
  );
}
