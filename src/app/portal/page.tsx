import { EstadoCuenta, EstadoPQRS, EstadoReserva, Prisma } from "@prisma/client";
import { getResidenteActual } from "@/lib/session";
import { getCuentasDeCobroDeResidente } from "@/lib/data/cartera-residente";
import { calcularSaldoPendiente } from "@/lib/data/cuentas-cobro";
import { getPqrsDeResidente } from "@/lib/data/pqrs";
import { getReservasDeResidente } from "@/lib/data/reservas";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatearMoneda } from "@/lib/formatters";

export const metadata = {
  title: "Mi portal · Rentu",
};

export default async function PortalHomePage() {
  const { usuario, inmuebleActivo } = await getResidenteActual();

  if (!inmuebleActivo) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
        No tienes ningún inmueble activo vinculado. Contacta a tu administrador.
      </p>
    );
  }

  const [cuentas, pqrs, reservas] = await Promise.all([
    getCuentasDeCobroDeResidente(inmuebleActivo.inmueble.id),
    getPqrsDeResidente(usuario.id, inmuebleActivo.inmueble.id),
    getReservasDeResidente(inmuebleActivo.inmueble.id),
  ]);

  const saldoPendiente = cuentas
    .filter((cuenta) => cuenta.estado !== EstadoCuenta.PAGADA)
    .reduce((suma, cuenta) => suma.plus(calcularSaldoPendiente(cuenta)), new Prisma.Decimal(0));

  const pqrsAbiertas = pqrs.filter((item) => item.estado !== EstadoPQRS.CERRADO).length;

  const proximasReservas = reservas.filter(
    (reserva) =>
      reserva.estado !== EstadoReserva.CANCELADA && new Date(reserva.fechaInicio) > new Date()
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
          Hola, {usuario.nombre.split(" ")[0]}
        </h1>
        <p className="text-sm text-zinc-500">
          {inmuebleActivo.inmueble.identificador} — {inmuebleActivo.inmueble.copropiedad.nombre}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          etiqueta="Saldo pendiente"
          valor={formatearMoneda(saldoPendiente)}
          tono={saldoPendiente.greaterThan(0) ? "alerta" : "positivo"}
        />
        <StatCard
          etiqueta="PQRS abiertas"
          valor={String(pqrsAbiertas)}
          tono={pqrsAbiertas > 0 ? "alerta" : "positivo"}
        />
        <StatCard etiqueta="Próximas reservas" valor={String(proximasReservas)} />
      </div>
    </div>
  );
}
