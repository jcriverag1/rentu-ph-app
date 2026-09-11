import { EstadoPQRS } from "@prisma/client";

const ESTILOS: Record<EstadoPQRS, string> = {
  ABIERTO: "bg-amber-50 text-amber-700 ring-amber-600/20",
  EN_PROCESO: "bg-blue-50 text-blue-700 ring-blue-600/20",
  CERRADO: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export const ETIQUETAS_ESTADO_PQRS: Record<EstadoPQRS, string> = {
  ABIERTO: "Pendiente",
  EN_PROCESO: "En gestión",
  CERRADO: "Cerrada",
};

export function EstadoPqrsBadge({ estado }: { estado: EstadoPQRS }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${ESTILOS[estado]}`}
    >
      {ETIQUETAS_ESTADO_PQRS[estado]}
    </span>
  );
}
