import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para Server Components, Route Handlers y Server
 * Actions. Se crea uno nuevo por cada render/request (nunca se comparte
 * entre requests), como exige `@supabase/ssr`.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se invocó desde un Server Component, que no puede escribir
            // cookies. El Proxy (src/proxy.ts) refresca la sesión en cada
            // request, así que esto es seguro de ignorar.
          }
        },
      },
    }
  );
}
