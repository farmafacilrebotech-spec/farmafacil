import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const farmaciaId = searchParams.get("farmacia_id")?.trim();

    if (!farmaciaId) {
      return NextResponse.json(
        { error: "farmacia_id es obligatorio" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("conversaciones")
      .select(
        "id, cliente_id, estado, created_at, cliente:clientes!conversaciones_cliente_id_fkey(nombre, telefono)"
      )
      .eq("farmacia_id", farmaciaId);

    if (error) throw error;

    const conversaciones = (data || []).sort((a, b) => {
      const aDerivada = a.estado === "derivada" ? 1 : 0;
      const bDerivada = b.estado === "derivada" ? 1 : 0;
      if (aDerivada !== bDerivada) return bDerivada - aDerivada;

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return NextResponse.json({ conversaciones });
  } catch (error: any) {
    console.error("ERROR /api/farmacia/conversaciones:", error);
    return NextResponse.json(
      { error: error?.message || "Error obteniendo conversaciones" },
      { status: 500 }
    );
  }
}
