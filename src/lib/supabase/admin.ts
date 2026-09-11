import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con `service_role` — solo para scripts de administración/provisión
 * (ver `scripts/provisionar-usuario-auth.ts`). NUNCA importar desde código
 * que se ejecute en respuesta a una request de un usuario: se salta RLS y
 * puede hacer cualquier operación sobre Supabase Auth.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
