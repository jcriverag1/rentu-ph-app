"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cerrarSesion } from "@/lib/actions/auth";

const ENLACES = [
  { href: "/portal", etiqueta: "Inicio" },
  { href: "/portal/cartera", etiqueta: "Mi cartera" },
  { href: "/portal/pqrs", etiqueta: "Mis PQRS" },
  { href: "/portal/reservas", etiqueta: "Mis reservas" },
] as const;

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 text-sm font-medium text-zinc-500">
      {ENLACES.map((enlace) => {
        const activo = pathname === enlace.href;
        return (
          <Link
            key={enlace.href}
            href={enlace.href}
            className={activo ? "text-brand-700" : "hover:text-brand-700"}
          >
            {enlace.etiqueta}
          </Link>
        );
      })}
      <form action={cerrarSesion}>
        <button type="submit" className="hover:text-zinc-700">
          Cerrar sesión
        </button>
      </form>
    </nav>
  );
}
