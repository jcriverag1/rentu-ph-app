/**
 * Rutas absolutas (`/#id`) en vez de anchors relativos (`#id`) porque estos
 * enlaces se reutilizan en páginas distintas de la landing (ej. /propiedades)
 * — un anchor relativo ahí apuntaría a un id que no existe en esa página.
 */
export const ENLACES_NAV = [
  { href: "/#por-que-rentu", etiqueta: "Beneficios" },
  { href: "/#modulos", etiqueta: "Módulos" },
  { href: "/propiedades", etiqueta: "Marketplace" },
  { href: "/#copiloto", etiqueta: "Copiloto IA" },
] as const;
