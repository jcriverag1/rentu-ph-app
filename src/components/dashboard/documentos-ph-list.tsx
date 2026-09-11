import type { DocumentoPHConCopropiedad } from "@/lib/data/documentos-ph";
import { formatearFecha } from "@/lib/formatters";

const ETIQUETAS_TIPO: Record<string, string> = {
  REGLAMENTO_PH: "Reglamento de PH",
  MANUAL_CONVIVENCIA: "Manual de convivencia",
  ACTA_ASAMBLEA: "Acta de asamblea",
  OTRO: "Otro",
};

export function DocumentosPHList({
  documentos,
}: {
  documentos: DocumentoPHConCopropiedad[];
}) {
  if (documentos.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Todavía no has indexado documentos de ninguna copropiedad.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      {documentos.map((documento) => (
        <li key={documento.id} className="flex items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {documento.titulo}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {documento.copropiedad.nombre} · {ETIQUETAS_TIPO[documento.tipo] ?? documento.tipo} ·{" "}
              {documento._count.chunks} fragmento(s) · {formatearFecha(documento.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
