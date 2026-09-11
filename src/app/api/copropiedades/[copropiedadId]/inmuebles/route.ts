import { NextResponse } from "next/server";
import { getAdministradorActual } from "@/lib/session";
import { getCopropiedadPorId } from "@/lib/data/copropiedades";
import { getInmueblesPorCopropiedad } from "@/lib/data/inmuebles";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ copropiedadId: string }> }
) {
  const { copropiedadId } = await params;
  const administrador = await getAdministradorActual();

  const copropiedad = await getCopropiedadPorId(
    copropiedadId,
    administrador.id
  );
  if (!copropiedad) {
    return NextResponse.json(
      { error: "Copropiedad no encontrada" },
      { status: 404 }
    );
  }

  const inmuebles = await getInmueblesPorCopropiedad(
    copropiedadId,
    administrador.id
  );

  return NextResponse.json({ data: inmuebles });
}
