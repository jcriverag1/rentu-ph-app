import { getAdministradorActual } from "@/lib/session";
import {
  getCopropiedadesConInmueblesParaInvitar,
  getResidentesDeAdministrador,
} from "@/lib/data/residentes";
import { InvitarResidenteForm } from "@/components/dashboard/invitar-residente-form";
import { ResidentesList } from "@/components/dashboard/residentes-list";

export const metadata = {
  title: "Residentes · Rentu",
};

export default async function ResidentesPage() {
  const administrador = await getAdministradorActual();

  const [copropiedades, residentes] = await Promise.all([
    getCopropiedadesConInmueblesParaInvitar(administrador.id),
    getResidentesDeAdministrador(administrador.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Residentes
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Invita a propietarios e inquilinos para que puedan entrar a su propio portal.
        </p>
      </div>

      <InvitarResidenteForm copropiedades={copropiedades} />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Residentes vinculados
        </h2>
        <ResidentesList residentes={residentes} />
      </section>
    </div>
  );
}
