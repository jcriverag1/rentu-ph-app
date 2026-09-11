import { Bot, Sparkles } from "lucide-react";

/**
 * Vista previa ilustrativa del Dashboard y el Copiloto — no es una captura
 * real, es un mockup en HTML/Tailwind para el Hero de la landing.
 */
export function DashboardMockup() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-brand-900/10">
      <div className="flex items-center gap-1.5 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="ml-2 text-xs font-medium text-zinc-400">Dashboard · Rentu</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-zinc-50 p-2.5">
          <p className="text-[10px] font-medium text-zinc-500">Copropiedades</p>
          <p className="text-lg font-bold text-zinc-900">3</p>
        </div>
        <div className="rounded-lg bg-brand-50 p-2.5">
          <p className="text-[10px] font-medium text-brand-700">Por cobrar</p>
          <p className="text-lg font-bold text-brand-700">$1.06M</p>
        </div>
        <div className="rounded-lg bg-accent-50 p-2.5">
          <p className="text-[10px] font-medium text-accent-700">En mora</p>
          <p className="text-lg font-bold text-accent-700">$645K</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
          <Sparkles className="h-3.5 w-3.5 text-accent-500" />
          Copiloto Administrativo
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-zinc-900 px-2.5 py-1.5 text-[11px] text-white">
            ¿Hasta qué hora puedo poner música?
          </div>
          <div className="flex max-w-[90%] items-start gap-1.5 rounded-lg rounded-tl-none bg-white px-2.5 py-1.5 text-[11px] text-zinc-700 ring-1 ring-zinc-200">
            <Bot className="mt-0.5 h-3 w-3 shrink-0 text-brand-600" />
            Según el Manual de Convivencia, hasta las 10:00 p.m. entre semana.
          </div>
        </div>
      </div>
    </div>
  );
}
