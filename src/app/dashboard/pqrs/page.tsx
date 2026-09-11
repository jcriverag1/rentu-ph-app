import Link from "next/link";
import { EstadoPQRS } from "@prisma/client";
import { getAdministradorActual } from "@/lib/session";
import {
  getCopropiedadesConInmueblesParaPqrs,
  getPqrsDeAdministrador,
  getResumenPqrs,
} from "@/lib/data/pqrs";
import { StatCard } from "@/components/dashboard/stat-card";
import { CrearPqrsForm } from "@/components/pqrs/crear-pqrs-form";
import { PqrsList } from "@/components/pqrs/pqrs-list";
import { ETIQUETAS_ESTADO_PQRS } from "@/components/pqrs/estado-pqrs-badge";

export const metadata = {
  title: "PQRS · Rentu",
};

const FILTROS = [
  { valor: undefined, etiqueta: "Todas" },
  { valor: EstadoPQRS.ABIERTO, etiqueta: ETIQUETAS_ESTADO_PQRS.ABIERTO },
  { valor: EstadoPQRS.EN_PROCESO, etiqueta: ETIQUETAS_ESTADO_PQRS.EN_PROCESO },
  { valor: EstadoPQRS.CERRADO, etiqueta: ETIQUETAS_ESTADO_PQRS.CERRADO },
] as const;

function esEstadoValido(valor: string | undefined): valor is EstadoPQRS {
  return !!valor && (Object.values(EstadoPQRS) as string[]).includes(valor);
}

export default async function PqrsPage(props: PageProps<"/dashboard/pqrs">) {
  const searchParams = await props.searchParams;
  const estadoParam = typeof searchParams.estado === "string" ? searchParams.estado : undefined;
  const estadoFiltro = esEstadoValido(estadoParam) ? estadoParam : undefined;

  const administrador = await getAdministradorActual();

  const [resumen, pqrs, copropiedades] = await Promise.all([
    getResumenPqrs(administrador.id),
    getPqrsDeAdministrador(administrador.id, estadoFiltro),
    getCopropiedadesConInmueblesParaPqrs(administrador.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          PQRS y convivencia
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Peticiones, quejas, reclamos y sugerencias de tus copropiedades.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          etiqueta={ETIQUETAS_ESTADO_PQRS.ABIERTO}
          valor={String(resumen.ABIERTO)}
          tono={resumen.ABIERTO > 0 ? "alerta" : "positivo"}
        />
        <StatCard etiqueta={ETIQUETAS_ESTADO_PQRS.EN_PROCESO} valor={String(resumen.EN_PROCESO)} />
        <StatCard etiqueta={ETIQUETAS_ESTADO_PQRS.CERRADO} valor={String(resumen.CERRADO)} tono="positivo" />
      </div>

      <CrearPqrsForm copropiedades={copropiedades} />

      <section className="flex flex-col gap-4">
        <nav className="flex flex-wrap gap-2">
          {FILTROS.map((filtro) => {
            const activo = filtro.valor === estadoFiltro;
            return (
              <Link
                key={filtro.etiqueta}
                href={filtro.valor ? `/dashboard/pqrs?estado=${filtro.valor}` : "/dashboard/pqrs"}
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

        <PqrsList items={pqrs} />
      </section>
    </div>
  );
}
