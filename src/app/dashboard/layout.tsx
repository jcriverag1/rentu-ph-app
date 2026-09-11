export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Rentu
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Hub Operativo de Propiedad Horizontal
            </p>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <span className="text-zinc-900 dark:text-zinc-50">Dashboard</span>
            <span className="cursor-not-allowed opacity-50">Copropiedades</span>
            <span className="cursor-not-allowed opacity-50">Cartera</span>
            <span className="cursor-not-allowed opacity-50">PQRS</span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
