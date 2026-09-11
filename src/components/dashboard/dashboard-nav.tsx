"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/dashboard", etiqueta: "Dashboard" },
  { href: "/dashboard/pqrs", etiqueta: "PQRS" },
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
                ? "text-zinc-900 dark:text-zinc-50"
                : "hover:text-zinc-700 dark:hover:text-zinc-200"
            }
          >
            {enlace.etiqueta}
          </Link>
        );
      })}
      <span className="cursor-not-allowed opacity-50">Copropiedades</span>
      <span className="cursor-not-allowed opacity-50">Cartera</span>
    </nav>
  );
}
