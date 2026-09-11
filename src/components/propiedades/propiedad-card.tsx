import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import type { PropiedadMarketplace } from "@/lib/data/propiedades";
import { formatearMoneda } from "@/lib/formatters";

export function PropiedadCard({ propiedad }: { propiedad: PropiedadMarketplace }) {
  const asunto = encodeURIComponent(
    `Interés en ${propiedad.identificador} — ${propiedad.copropiedad.nombre}`
  );
  const cuerpo = encodeURIComponent(
    "Hola, quisiera más información y agendar una visita a este inmueble."
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {propiedad.imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- foto externa de Unsplash, sin dominio propio
          <img
            src={propiedad.imagenUrl}
            alt={`Fachada de ${propiedad.identificador} en ${propiedad.copropiedad.nombre}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <span className="absolute right-3 top-3 rounded-full bg-accent-400 px-3 py-1 text-sm font-bold text-zinc-900 shadow-sm">
          {formatearMoneda(propiedad.canonArriendo ?? 0)}/mes
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">{propiedad.identificador}</h3>
          <p className="flex items-center gap-1 text-sm text-zinc-500">
            <MapPin className="h-3.5 w-3.5" />
            {propiedad.copropiedad.nombre} · {propiedad.copropiedad.ciudad}
          </p>
        </div>

        <div className="flex items-center gap-4 border-y border-zinc-100 py-3 text-sm text-zinc-700">
          {propiedad.areaM2 ? (
            <span className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4 text-brand-600" />
              {Number(propiedad.areaM2)} m²
            </span>
          ) : null}
          {propiedad.habitaciones ? (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-brand-600" />
              {propiedad.habitaciones}
            </span>
          ) : null}
          {propiedad.banos ? (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-brand-600" />
              {propiedad.banos}
            </span>
          ) : null}
        </div>

        {propiedad.descripcionArriendo ? (
          <p className="line-clamp-2 text-sm text-zinc-600">{propiedad.descripcionArriendo}</p>
        ) : null}

        <a
          href={`mailto:arriendos@rentuph.com?subject=${asunto}&body=${cuerpo}`}
          className="mt-auto inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Solicitar información
        </a>
      </div>
    </div>
  );
}
