import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PREFIJOS_PROTEGIDOS = ["/dashboard"];

/**
 * Refresca la sesión de Supabase en cada request y protege las rutas del
 * Administrador. Se usa desde `src/proxy.ts` (el Proxy corre en runtime
 * Node.js por defecto en Next 16, así que esto no tiene restricciones de
 * Edge).
 */
export async function actualizarSesion(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // `getUser()` (no `getSession()`) revalida el JWT contra Supabase Auth en
  // cada llamada — más lento que leer la cookie, pero es la única forma
  // segura de confiar en la sesión en código de servidor.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rutaProtegida = PREFIJOS_PROTEGIDOS.some((prefijo) =>
    request.nextUrl.pathname.startsWith(prefijo)
  );

  if (!user && rutaProtegida) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
