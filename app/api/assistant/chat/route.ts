export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { POST as chatPost } from "@/app/api/chat/route";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const normalizedBody = {
      mensaje: body?.mensaje,
      cliente_id: body?.cliente_id,
      farmacia_id: body?.farmacia_id,
      conversacion_id: body?.conversacion_id,
      nombre_farmacia: body?.nombre_farmacia,
    };

    const proxiedRequest = new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedBody),
    });

    const response = await chatPost(proxiedRequest);
    const payload = await response.json();

    return NextResponse.json(
      {
        success: response.ok,
        ...payload,
      },
      { status: response.status }
    );
  } catch (error: any) {
    console.error("Error in /api/assistant/chat compatibility route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
