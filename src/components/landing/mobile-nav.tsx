"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const ENLACES = [
  { href: "#por-que-rentu", etiqueta: "Beneficios" },
  { href: "#modulos", etiqueta: "Módulos" },
  { href: "#copiloto", etiqueta: "Copiloto IA" },
] as const;

export function MobileNav() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label="Abrir menú"
        className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100"
      >
        {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {abierto ? (
        <div className="absolute inset-x-0 top-full border-b border-zinc-200 bg-white px-6 py-4 shadow-lg">
          <nav className="flex flex-col gap-3 text-sm font-medium text-zinc-700">
            {ENLACES.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                onClick={() => setAbierto(false)}
                className="py-1"
              >
                {enlace.etiqueta}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setAbierto(false)}
              className="mt-2 rounded-md bg-brand-600 px-4 py-2 text-center font-semibold text-white"
            >
              Ingresar al Portal
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
