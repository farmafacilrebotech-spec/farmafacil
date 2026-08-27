export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { fetchBonusDeliveryStatusFromAppsScript } from "@/lib/bonos/apps-script";
import { BONO_NO_STORE_HEADERS, tokenPreview } from "@/lib/bonos/types";

/**
 * GET /api/bonos/entrega/token?token=XXXXX
 * Consulta el estado de entrega en Apps Script (bonus-delivery-status).
 * Nunca revela el código Amazon automáticamente.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = (searchParams.get("token") || "").trim();

    console.log("[bono-entrega] Consulta recibida");
    console.log("[bono-entrega] Token:", tokenPreview(token) || "(vacío)");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          status: "invalid",
          error: "Falta el token",
        },
        { headers: BONO_NO_STORE_HEADERS }
      );
    }

    const result = await fetchBonusDeliveryStatusFromAppsScript(token);

    if (!result.ok) {
      console.error("[bono-entrega] Fallo al consultar estado");
      // Error técnico: no convertir en invalid/expired/revealed
      return NextResponse.json(
        {
          success: false,
          error:
            "No hemos podido consultar tu bono en este momento. Inténtalo de nuevo en unos minutos.",
          technical: true,
        },
        { status: 502, headers: BONO_NO_STORE_HEADERS }
      );
    }

    const payload: Record<string, unknown> = {
      success: true,
      status: result.status,
    };

    if (result.meta.nombre) payload.nombre = result.meta.nombre;
    if (result.meta.farmacia) payload.farmacia = result.meta.farmacia;
    if (result.meta.importe) payload.importe = result.meta.importe;
    if (result.meta.fechaLimite) payload.fechaLimite = result.meta.fechaLimite;

    // Solo devolver código si Apps Script lo incluyó en el estado (ya revelado).
    if (result.status === "already_revealed" && result.codigoAmazon) {
      payload.codigoAmazon = result.codigoAmazon;
      payload.hasCodigo = true;
    } else if (result.status === "already_revealed") {
      payload.hasCodigo = false;
    }

    return NextResponse.json(payload, { headers: BONO_NO_STORE_HEADERS });
  } catch (error) {
    console.error(
      "[bono-entrega] Error al validar token de entrega:",
      (error as Error).message
    );
    return NextResponse.json(
      {
        success: false,
        error:
          "No hemos podido consultar tu bono en este momento. Inténtalo de nuevo en unos minutos.",
        technical: true,
      },
      { status: 500, headers: BONO_NO_STORE_HEADERS }
    );
  }
}
