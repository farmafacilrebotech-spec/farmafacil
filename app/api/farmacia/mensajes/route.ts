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
    const conversacionId = searchParams.get("conversacion_id")?.trim();

    if (!conversacionId) {
      return NextResponse.json(
        { error: "conversacion_id es obligatorio" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("mensajes")
      .select("id, conversacion_id, emisor, mensaje, leido, created_at")
      .eq("conversacion_id", conversacionId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ mensajes: data || [] });
  } catch (error: any) {
    console.error("ERROR /api/farmacia/mensajes:", error);
    return NextResponse.json(
      { error: error?.message || "Error obteniendo mensajes" },
      { status: 500 }
    );
  }
}
