export function FiltrosMarketplace({
  copropiedades,
  valores,
}: {
  copropiedades: { id: string; nombre: string }[];
  valores: { precioMax?: string; copropiedadId?: string; habitacionesMin?: string };
}) {
  return (
    <form
      method="get"
      className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="copropiedadId" className="text-xs font-medium text-zinc-500">
          Copropiedad
        </label>
        <select
          id="copropiedadId"
          name="copropiedadId"
          defaultValue={valores.copropiedadId ?? ""}
          className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Todas</option>
          {copropiedades.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="habitacionesMin" className="text-xs font-medium text-zinc-500">
          Mínimo de habitaciones
        </label>
        <select
          id="habitacionesMin"
          name="habitacionesMin"
          defaultValue={valores.habitacionesMin ?? ""}
          className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Cualquiera</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="precioMax" className="text-xs font-medium text-zinc-500">
          Canon máximo
        </label>
        <input
          id="precioMax"
          name="precioMax"
          type="text"
          inputMode="decimal"
          defaultValue={valores.precioMax ?? ""}
          placeholder="ej. 2500000"
          className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm tabular-nums focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Filtrar
        </button>
      </div>
    </form>
  );
}
