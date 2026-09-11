import { Suspense } from "react";
import { getAdministradorActual } from "@/lib/session";
import { getCopropiedadesDelAdministrador } from "@/lib/data/copropiedades";
import { getResumenInmuebles } from "@/lib/data/inmuebles";
import {
  getCuentasDeCobroRecientes,
  getResumenCartera,
} from "@/lib/data/cuentas-cobro";
import { getDocumentosPHDelAdministrador } from "@/lib/data/documentos-ph";
import { StatCard } from "@/components/dashboard/stat-card";
import { CopropiedadesGrid } from "@/components/dashboard/copropiedades-grid";
import { CuentasDeCobroTable } from "@/components/dashboard/cuentas-de-cobro-table";
import { GenerarCuentasForm } from "@/components/dashboard/generar-cuentas-form";
import { SubirDocumentoForm } from "@/components/dashboard/subir-documento-form";
import { DocumentosPHList } from "@/components/dashboard/documentos-ph-list";
import { CopilotoChat } from "@/components/dashboard/copiloto-chat";
import { formatearMoneda } from "@/lib/formatters";

export const metadata = {
  title: "Dashboard · Rentu",
};

export default async function DashboardPage() {
  const administrador = await getAdministradorActual();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Hola, {administrador.nombre.split(" ")[0]}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Este es el resumen operativo de tus copropiedades.
        </p>
      </div>

      <Suspense fallback={<KpisSkeleton />}>
        <Kpis administradorId={administrador.id} />
      </Suspense>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Copropiedades administradas
        </h2>
        <Suspense fallback={<SeccionSkeleton lineas={3} />}>
          <SeccionCopropiedades administradorId={administrador.id} />
        </Suspense>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Generación de cartera
        </h2>
        <Suspense fallback={<SeccionSkeleton lineas={2} />}>
          <SeccionGenerarCuentas administradorId={administrador.id} />
        </Suspense>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Cuentas de cobro recientes
        </h2>
        <Suspense fallback={<SeccionSkeleton lineas={5} />}>
          <SeccionCuentasDeCobro administradorId={administrador.id} />
        </Suspense>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Copiloto Administrativo
        </h2>
        <Suspense fallback={<SeccionSkeleton lineas={2} />}>
          <SeccionCopiloto administradorId={administrador.id} />
        </Suspense>
      </section>
    </div>
  );
}

async function SeccionCopiloto({ administradorId }: { administradorId: string }) {
  const [copropiedades, documentos] = await Promise.all([
    getCopropiedadesDelAdministrador(administradorId),
    getDocumentosPHDelAdministrador(administradorId),
  ]);
  const opcionesCopropiedad = copropiedades.map(({ id, nombre }) => ({ id, nombre }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <SubirDocumentoForm copropiedades={opcionesCopropiedad} />
        <DocumentosPHList documentos={documentos} />
      </div>
      <CopilotoChat copropiedades={opcionesCopropiedad} />
    </div>
  );
}

async function SeccionGenerarCuentas({
  administradorId,
}: {
  administradorId: string;
}) {
  const copropiedades = await getCopropiedadesDelAdministrador(administradorId);
  return (
    <GenerarCuentasForm
      copropiedades={copropiedades.map(({ id, nombre }) => ({ id, nombre }))}
    />
  );
}

async function Kpis({ administradorId }: { administradorId: string }) {
  const [resumenInmuebles, resumenCartera, copropiedades] = await Promise.all([
    getResumenInmuebles(administradorId),
    getResumenCartera(administradorId),
    getCopropiedadesDelAdministrador(administradorId),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        etiqueta="Copropiedades"
        valor={String(copropiedades.length)}
      />
      <StatCard
        etiqueta="Inmuebles"
        valor={String(resumenInmuebles.total)}
        detalle={`${resumenInmuebles.ocupados} ocupados · ${resumenInmuebles.desocupados} desocupados`}
      />
      <StatCard
        etiqueta="Cartera por cobrar"
        valor={formatearMoneda(resumenCartera.totalPorCobrar)}
        detalle={`${resumenCartera.cantidadPorCobrar} cuentas`}
      />
      <StatCard
        etiqueta="En mora"
        valor={formatearMoneda(resumenCartera.totalEnMora)}
        detalle={`${resumenCartera.cantidadEnMora} cuentas en mora`}
        tono={resumenCartera.cantidadEnMora > 0 ? "alerta" : "positivo"}
      />
    </div>
  );
}

async function SeccionCopropiedades({
  administradorId,
}: {
  administradorId: string;
}) {
  const copropiedades = await getCopropiedadesDelAdministrador(administradorId);
  return <CopropiedadesGrid copropiedades={copropiedades} />;
}

async function SeccionCuentasDeCobro({
  administradorId,
}: {
  administradorId: string;
}) {
  const cuentas = await getCuentasDeCobroRecientes(administradorId);
  return <CuentasDeCobroTable cuentas={cuentas} />;
}

function KpisSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
        />
      ))}
    </div>
  );
}

function SeccionSkeleton({ lineas }: { lineas: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lineas }).map((_, i) => (
        <div
          key={i}
          className="h-12 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
        />
      ))}
    </div>
  );
}
