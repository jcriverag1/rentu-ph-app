import { getResidenteActual } from "@/lib/session";
import { getPqrsDeResidente } from "@/lib/data/pqrs";
import { CrearPqrsForm } from "@/components/portal/crear-pqrs-form";
import { PqrsList } from "@/components/portal/pqrs-list";

export const metadata = {
  title: "Mis PQRS · Rentu",
};

export default async function PqrsResidentePage() {
  const { usuario, inmuebleActivo } = await getResidenteActual();

  if (!inmuebleActivo) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
        No tienes ningún inmueble activo vinculado. Contacta a tu administrador.
      </p>
    );
  }

  const pqrs = await getPqrsDeResidente(usuario.id, inmuebleActivo.inmueble.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Mis PQRS</h1>
        <p className="text-sm text-zinc-500">
          Peticiones, quejas, reclamos y sugerencias de {inmuebleActivo.inmueble.identificador}.
        </p>
      </div>

      <CrearPqrsForm />

      <section className="flex flex-col gap-4">
        <PqrsList items={pqrs} usuarioId={usuario.id} />
      </section>
    </div>
  );
}
