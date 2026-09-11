import Link from "next/link";
import { Building2 } from "lucide-react";
import { ENLACES_NAV } from "@/components/landing/nav-links";

export function SiteFooter() {
  const anio = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Building2 className="h-4 w-4" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-zinc-900">
            Rentu<span className="text-accent-500">PH</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
          {ENLACES_NAV.map((enlace) => (
            <Link key={enlace.href} href={enlace.href} className="hover:text-brand-700">
              {enlace.etiqueta}
            </Link>
          ))}
          <Link href="/login" className="hover:text-brand-700">
            Ingresar al Portal
          </Link>
        </nav>

        <p className="text-xs text-zinc-400">
          © {anio} Rentu PH — Hub Operativo de Propiedad Horizontal.
        </p>
      </div>
    </footer>
  );
}
