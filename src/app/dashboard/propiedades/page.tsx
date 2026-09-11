import Link from "next/link";
import { getAdministradorActual } from "@/lib/session";
import { getInmueblesDelAdministradorParaMarketplace } from "@/lib/data/propiedades";
import { InmueblesAdminList } from "@/components/propiedades/inmuebles-admin-list";

export const metadata = {
  title: "Propiedades · Rentu",
};

export default async function PropiedadesDashboardPage() {
  const administrador = await getAdministradorActual();
  const inmuebles = await getInmueblesDelAdministradorParaMarketplace(administrador.id);
  const publicados = inmuebles.filter((i) => i.disponibleArriendo).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Propiedades en el marketplace
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gestiona qué inmuebles aparecen publicados en{" "}
            <Link href="/propiedades" className="text-brand-700 underline underline-offset-2">
              /propiedades
            </Link>
            .
          </p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
          {publicados} de {inmuebles.length} publicados
        </span>
      </div>

      <InmueblesAdminList inmuebles={inmuebles} />
    </div>
  );
}
