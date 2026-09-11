"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cerrarSesion } from "@/lib/actions/auth";

const ENLACES = [
  { href: "/dashboard", etiqueta: "Dashboard" },
  { href: "/dashboard/pqrs", etiqueta: "PQRS" },
  { href: "/dashboard/reservas", etiqueta: "Reservas" },
  { href: "/dashboard/propiedades", etiqueta: "Propiedades" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
      {ENLACES.map((enlace) => {
        const activo = pathname === enlace.href;
        return (
          <Link
            key={enlace.href}
            href={enlace.href}
            className={
              activo
                ? "text-brand-700 dark:text-brand-400"
                : "hover:text-brand-700 dark:hover:text-brand-400"
            }
          >
            {enlace.etiqueta}
          </Link>
        );
      })}
      <span className="cursor-not-allowed opacity-50">Copropiedades</span>
      <span className="cursor-not-allowed opacity-50">Cartera</span>
      <form action={cerrarSesion}>
        <button type="submit" className="hover:text-zinc-700 dark:hover:text-zinc-200">
          Cerrar sesión
        </button>
      </form>
    </nav>
  );
}
