export function StatCard({
  etiqueta,
  valor,
  detalle,
  tono = "neutral",
}: {
  etiqueta: string;
  valor: string;
  detalle?: string;
  tono?: "neutral" | "alerta" | "positivo";
}) {
  const colorDetalle =
    tono === "alerta"
      ? "text-red-600"
      : tono === "positivo"
        ? "text-emerald-600"
        : "text-zinc-500";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {etiqueta}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {valor}
      </p>
      {detalle ? (
        <p className={`mt-1 text-sm ${colorDetalle}`}>{detalle}</p>
      ) : null}
    </div>
  );
}
