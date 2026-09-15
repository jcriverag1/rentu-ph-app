import { EstadoCuenta } from "@prisma/client";
import { getResidenteActual } from "@/lib/session";
import { getCuentasDeCobroDeResidente } from "@/lib/data/cartera-residente";
import { calcularSaldoPendiente } from "@/lib/data/cuentas-cobro";
import { EstadoCuentaBadge } from "@/components/dashboard/estado-badge";
import { formatearFecha, formatearMoneda, formatearPeriodo } from "@/lib/formatters";

export const metadata = {
  title: "Mi cartera · Rentu",
};

export default async function CarteraResidentePage() {
  const { inmuebleActivo } = await getResidenteActual();

  if (!inmuebleActivo) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
        No tienes ningún inmueble activo vinculado. Contacta a tu administrador.
      </p>
    );
  }

  const cuentas = await getCuentasDeCobroDeResidente(inmuebleActivo.inmueble.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Mi cartera</h1>
        <p className="text-sm text-zinc-500">
          {inmuebleActivo.inmueble.identificador} — {inmuebleActivo.inmueble.copropiedad.nombre}
        </p>
      </div>

      {cuentas.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
          Todavía no tienes cuentas de cobro generadas.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {cuentas.map((cuenta) => {
            const saldoPendiente = calcularSaldoPendiente(cuenta);
            const estaPagada = cuenta.estado === EstadoCuenta.PAGADA;

            return (
              <li
                key={cuenta.id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {formatearPeriodo(cuenta.periodo)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Vence {formatearFecha(cuenta.fechaLimitePago)}
                    </p>
                  </div>
                  <EstadoCuentaBadge estado={cuenta.estado} />
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500">Total a pagar</p>
                    <p className="font-medium text-zinc-900">
                      {formatearMoneda(cuenta.totalAPagar)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Saldo pendiente</p>
                    <p className="font-medium text-zinc-900">
                      {estaPagada ? "—" : formatearMoneda(saldoPendiente)}
                    </p>
                  </div>
                </div>

                {cuenta.pagos.length > 0 ? (
                  <div className="rounded-lg bg-zinc-50 p-3">
                    <p className="text-xs font-medium text-zinc-500">Pagos registrados</p>
                    <ul className="mt-1 flex flex-col gap-1">
                      {cuenta.pagos.map((pago) => (
                        <li key={pago.id} className="flex justify-between text-xs text-zinc-600">
                          <span>
                            {formatearFecha(pago.fechaPago)} · {pago.metodo}
                          </span>
                          <span className="font-medium">{formatearMoneda(pago.monto)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
