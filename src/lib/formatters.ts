const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const formatoFecha = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatearMoneda(
  valor: number | string | { toString(): string }
): string {
  return formatoMoneda.format(Number(valor.toString()));
}

export function formatearFecha(valor: Date | string): string {
  return formatoFecha.format(new Date(valor));
}

export function formatearPeriodo(periodo: string): string {
  const [anio, mes] = periodo.split("-");
  const nombresMes = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const indice = Number(mes) - 1;
  return `${nombresMes[indice] ?? mes} ${anio}`;
}
