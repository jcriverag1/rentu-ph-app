import { Bot, CalendarClock, MessagesSquare, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MODULOS: {
  id?: string;
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
  destacado?: boolean;
}[] = [
  {
    id: "copiloto",
    icono: Bot,
    titulo: "Copiloto Administrativo RAG",
    descripcion:
      "Consultas del reglamento, manual de convivencia y actas en tiempo real, con respuestas basadas únicamente en los documentos de tu copropiedad.",
    destacado: true,
  },
  {
    icono: MessagesSquare,
    titulo: "Módulo de PQRS",
    descripcion:
      "Radicación secuencial (PQRS-2026-XXXX), filtros por estado y trazabilidad completa de cada respuesta del administrador.",
  },
  {
    icono: Wallet,
    titulo: "Cuentas de Cobro y Cartera",
    descripcion:
      "Genera cuentas por coeficiente, registra abonos parciales o totales y monitorea la cartera en mora en tiempo real.",
  },
  {
    icono: CalendarClock,
    titulo: "Reservas de Zonas Comunes",
    descripcion:
      "Agenda de salón social, BBQ y canchas con bloqueo automático a inmuebles que no estén a paz y salvo.",
  },
];

export function ModulosGrid() {
  return (
    <section id="modulos" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Todo lo que necesita tu copropiedad, en un solo lugar
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Cuatro módulos que cubren el día a día de un Administrador de PH.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {MODULOS.map((modulo) => (
            <div
              key={modulo.titulo}
              id={modulo.id}
              className={`rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md ${
                modulo.destacado
                  ? "border-brand-200 bg-brand-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  modulo.destacado
                    ? "bg-brand-600 text-white"
                    : "bg-zinc-900 text-white"
                }`}
              >
                <modulo.icono className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-zinc-900">{modulo.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {modulo.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
