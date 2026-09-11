import { NextResponse, type NextRequest } from "next/server";
import { EstadoCuenta } from "@prisma/client";
import { getAdministradorActual } from "@/lib/session";
import { getCuentasDeCobroRecientes } from "@/lib/data/cuentas-cobro";

const ESTADOS_VALIDOS = new Set(Object.values(EstadoCuenta));

export async function GET(request: NextRequest) {
  const administrador = await getAdministradorActual();

  const searchParams = request.nextUrl.searchParams;
  const estadoParam = searchParams.get("estado");
  const limiteParam = Number(searchParams.get("limite"));
  const limite =
    Number.isFinite(limiteParam) && limiteParam > 0
      ? Math.min(limiteParam, 50)
      : 8;

  if (estadoParam && !ESTADOS_VALIDOS.has(estadoParam as EstadoCuenta)) {
    return NextResponse.json(
      { error: `Estado inválido: ${estadoParam}` },
      { status: 400 }
    );
  }

  const cuentas = await getCuentasDeCobroRecientes(administrador.id, limite);
  const data = estadoParam
    ? cuentas.filter((cuenta) => cuenta.estado === estadoParam)
    : cuentas;

  return NextResponse.json({ data });
}
