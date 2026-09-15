import { getResidenteActual } from "@/lib/session";
import { getReservasDeResidente, getZonasComunesDeCopropiedad } from "@/lib/data/reservas";
import { CrearReservaForm } from "@/components/portal/crear-reserva-form";
import { ReservasList } from "@/components/portal/reservas-list";

export const metadata = {
  title: "Mis reservas · Rentu",
};

export default async function ReservasResidentePage() {
  const { inmuebleActivo } = await getResidenteActual();

  if (!inmuebleActivo) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
        No tienes ningún inmueble activo vinculado. Contacta a tu administrador.
      </p>
    );
  }

  const [zonas, reservas] = await Promise.all([
    getZonasComunesDeCopropiedad(inmuebleActivo.inmueble.copropiedad.id),
    getReservasDeResidente(inmuebleActivo.inmueble.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Mis reservas</h1>
        <p className="text-sm text-zinc-500">
          Si tu inmueble tiene cuentas vencidas o en mora, no vas a poder radicar una reserva.
        </p>
      </div>

      <CrearReservaForm zonas={zonas} />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Mis solicitudes</h2>
        <ReservasList reservas={reservas} />
      </section>
    </div>
  );
}
