export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { revealBonusViaAppsScript } from "@/lib/bonos/apps-script";
import { BONO_NO_STORE_HEADERS, tokenPreview } from "@/lib/bonos/types";

/**
 * POST /api/bonos/entrega/revelar
 * Body: { token }
 * Añade el secret en servidor y llama a Apps Script (bonus-reveal).
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { token?: unknown };
    const token = typeof body.token === "string" ? body.token.trim() : "";

    console.log("[bono-entrega] Solicitud de revelado");
    console.log("[bono-entrega] Token:", tokenPreview(token) || "(vacío)");

    if (!token) {
      return NextResponse.json(
        { success: false, status: "invalid", error: "Falta el token" },
        { status: 400, headers: BONO_NO_STORE_HEADERS }
      );
    }

    const result = await revealBonusViaAppsScript(token);

    if (result.ok) {
      const payload: Record<string, unknown> = {
        success: true,
        status: result.status,
        codigoAmazon: result.codigoAmazon,
      };
      if (result.meta.nombre) payload.nombre = result.meta.nombre;
      if (result.meta.farmacia) payload.farmacia = result.meta.farmacia;
      if (result.meta.importe) payload.importe = result.meta.importe;
      if (result.meta.fechaLimite) payload.fechaLimite = result.meta.fechaLimite;

      return NextResponse.json(payload, { headers: BONO_NO_STORE_HEADERS });
    }

    if (result.status === "expired") {
      return NextResponse.json(
        {
          success: false,
          status: "expired",
          error: result.error,
        },
        { status: 410, headers: BONO_NO_STORE_HEADERS }
      );
    }

    if (result.status === "invalid") {
      return NextResponse.json(
        {
          success: false,
          status: "invalid",
          error: result.error,
        },
        { status: 400, headers: BONO_NO_STORE_HEADERS }
      );
    }

    if (result.alreadyRevealedWithoutCode || result.status === "already_revealed") {
      return NextResponse.json(
        {
          success: false,
          status: "already_revealed",
          hasCodigo: false,
          error: result.error,
        },
        { status: 409, headers: BONO_NO_STORE_HEADERS }
      );
    }

    console.error("[bono-entrega] Apps Script no confirmó el revelado");
    return NextResponse.json(
      {
        success: false,
        technical: true,
        error:
          "No hemos podido consultar tu bono en este momento. Inténtalo de nuevo en unos minutos.",
      },
      { status: 502, headers: BONO_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error(
      "[bono-entrega] Error en /api/bonos/entrega/revelar:",
      (error as Error).message
    );
    return NextResponse.json(
      {
        success: false,
        technical: true,
        error:
          "No hemos podido consultar tu bono en este momento. Inténtalo de nuevo en unos minutos.",
      },
      { status: 500, headers: BONO_NO_STORE_HEADERS }
    );
  }
}
