import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Body = {
  conversacion_id?: unknown;
  mensaje?: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const conversacionId = asString(body.conversacion_id);
    const mensaje = asString(body.mensaje);

    if (!conversacionId || !mensaje) {
      return NextResponse.json(
        { error: "conversacion_id y mensaje son obligatorios" },
        { status: 400 }
      );
    }

    const { error: errorInsert } = await supabase.from("mensajes").insert({
      conversacion_id: conversacionId,
      emisor: "farmacia",
      mensaje,
    });

    if (errorInsert) throw errorInsert;

    const { data: conversacion, error: errorUpdate } = await supabase
      .from("conversaciones")
      .update({ estado: "abierta" })
      .eq("id", conversacionId)
      .select("id")
      .maybeSingle();

    if (errorUpdate) throw errorUpdate;

    if (!conversacion) {
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      conversacion_id: conversacionId,
      estado: "abierta",
    });
  } catch (error: any) {
    console.error("ERROR /api/responder-farmacia:", error);
    return NextResponse.json(
      { error: error?.message || "Error respondiendo conversación" },
      { status: 500 }
    );
  }
}
