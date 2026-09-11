import { NextResponse } from "next/server";
import { getAdministradorActual } from "@/lib/session";
import { getCopropiedadesDelAdministrador } from "@/lib/data/copropiedades";

export async function GET() {
  const administrador = await getAdministradorActual();
  const copropiedades = await getCopropiedadesDelAdministrador(
    administrador.id
  );

  return NextResponse.json({ data: copropiedades });
}
