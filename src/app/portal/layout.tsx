import type { ReactNode } from "react";
import { getResidenteActual } from "@/lib/session";
import { PortalNav } from "@/components/portal/portal-nav";
import { SeleccionarInmuebleForm } from "@/components/portal/seleccionar-inmueble-form";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const { vinculos, inmuebleActivo } = await getResidenteActual();

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-lg font-semibold text-zinc-900">Rentu</p>
            <p className="text-xs text-zinc-500">
              {inmuebleActivo
                ? `${inmuebleActivo.inmueble.identificador} — ${inmuebleActivo.inmueble.copropiedad.nombre}`
                : "Portal del residente"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {vinculos.length > 1 ? (
              <SeleccionarInmuebleForm
                vinculos={vinculos}
                inmuebleActivoId={inmuebleActivo?.inmueble.id}
              />
            ) : null}
            <PortalNav />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
