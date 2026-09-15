import { randomBytes, scryptSync } from "node:crypto";

/**
 * Mismo esquema de hash que usa `prisma/seed.ts` (scrypt nativo de Node, sin
 * dependencias externas). El hash se guarda en `Usuario.passwordHash` por
 * completitud del modelo, pero la autenticación real la hace Supabase Auth
 * (ver `src/lib/session.ts`) — este campo no se usa para validar el login.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function generarPasswordTemporal(): string {
  return randomBytes(9).toString("base64url");
}
