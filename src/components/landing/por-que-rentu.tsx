import Link from "next/link";
import { Eye, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const DIFERENCIADORES: { icono: LucideIcon; titulo: string; descripcion: string }[] = [
  {
    icono: Eye,
    titulo: "Transparencia",
    descripcion:
      "Cada cuenta de cobro, pago y PQRS queda registrado y trazable — nada se pierde en un correo o un cuaderno.",
  },
  {
    icono: Sparkles,
    titulo: "Automatización",
    descripcion:
      "Cuentas de cobro por coeficiente, alertas de mora y bloqueo de reservas: las reglas se aplican solas, sin depender de que alguien se acuerde.",
  },
  {
    icono: Users,
    titulo: "Autogestión",
    descripcion:
      "El Copiloto resuelve las preguntas frecuentes del reglamento al instante, para que el Administrador se enfoque en lo que de verdad requiere su criterio.",
  },
];

export function PorQueRentu() {
  return (
    <section id="por-que-rentu" className="bg-zinc-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            ¿Por qué Rentu?
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Menos hojas de cálculo, menos WhatsApp perdido, más control real.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {DIFERENCIADORES.map((item) => (
            <div key={item.titulo} className="text-center sm:text-left">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700 sm:mx-0">
                <item.icono className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-zinc-900">{item.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {item.descripcion}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-brand-700 px-8 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-xl font-bold text-white">
              ¿Listo para dejar de perseguir cartera por WhatsApp?
            </p>
            <p className="mt-1 text-brand-100">
              Entra a la demo con el usuario Administrador y explora el sistema completo.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-accent-400 px-6 py-3 text-base font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-accent-300"
          >
            Probar Demo Admin
          </Link>
        </div>
      </div>
    </section>
  );
}
