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

const formatoFechaLarga = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

const formatoHora = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatearMoneda(
  valor: number | string | { toString(): string }
): string {
  return formatoMoneda.format(Number(valor.toString()));
}

export function formatearFecha(valor: Date | string): string {
  return formatoFecha.format(new Date(valor));
}

export function formatearFechaLarga(valor: Date | string): string {
  const fecha = formatoFechaLarga.format(new Date(valor));
  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

export function formatearHora(valor: Date | string): string {
  return formatoHora.format(new Date(valor));
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
