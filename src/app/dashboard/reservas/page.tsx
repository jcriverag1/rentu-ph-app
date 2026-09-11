import Link from "next/link";
import { EstadoReserva } from "@prisma/client";
import { getAdministradorActual } from "@/lib/session";
import {
  getCopropiedadesParaReservas,
  getReservasDeAdministrador,
  getZonasComunesDeAdministrador,
} from "@/lib/data/reservas";
import { CrearZonaComunForm } from "@/components/reservas/crear-zona-comun-form";
import { ZonasComunesList } from "@/components/reservas/zonas-comunes-list";
import { CrearReservaForm } from "@/components/reservas/crear-reserva-form";
import { AgendaReservas } from "@/components/reservas/agenda-reservas";
import { ETIQUETAS_ESTADO_RESERVA } from "@/components/reservas/estado-reserva-badge";

export const metadata = {
  title: "Reservas · Rentu",
};

const FILTROS = [
  { valor: undefined, etiqueta: "Todas" },
  { valor: EstadoReserva.PENDIENTE, etiqueta: ETIQUETAS_ESTADO_RESERVA.PENDIENTE },
  { valor: EstadoReserva.CONFIRMADA, etiqueta: ETIQUETAS_ESTADO_RESERVA.CONFIRMADA },
  { valor: EstadoReserva.CANCELADA, etiqueta: ETIQUETAS_ESTADO_RESERVA.CANCELADA },
] as const;

function esEstadoValido(valor: string | undefined): valor is EstadoReserva {
  return !!valor && (Object.values(EstadoReserva) as string[]).includes(valor);
}

export default async function ReservasPage(props: PageProps<"/dashboard/reservas">) {
  const searchParams = await props.searchParams;
  const estadoParam = typeof searchParams.estado === "string" ? searchParams.estado : undefined;
  const estadoFiltro = esEstadoValido(estadoParam) ? estadoParam : undefined;

  const administrador = await getAdministradorActual();

  const [zonas, reservas, copropiedades] = await Promise.all([
    getZonasComunesDeAdministrador(administrador.id),
    getReservasDeAdministrador(administrador.id, estadoFiltro),
    getCopropiedadesParaReservas(administrador.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Reservas de zonas comunes
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Un inmueble con cuentas en mora no puede solicitar ni confirmar reservas.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Zonas comunes</h2>
        <ZonasComunesList zonas={zonas} />
        <CrearZonaComunForm
          copropiedades={copropiedades.map(({ id, nombre }) => ({ id, nombre }))}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Radicar reserva</h2>
        <CrearReservaForm copropiedades={copropiedades} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Agenda</h2>
        <nav className="flex flex-wrap gap-2">
          {FILTROS.map((filtro) => {
            const activo = filtro.valor === estadoFiltro;
            return (
              <Link
                key={filtro.etiqueta}
                href={filtro.valor ? `/dashboard/reservas?estado=${filtro.valor}` : "/dashboard/reservas"}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  activo
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {filtro.etiqueta}
              </Link>
            );
          })}
        </nav>
        <AgendaReservas reservas={reservas} />
      </section>
    </div>
  );
}
