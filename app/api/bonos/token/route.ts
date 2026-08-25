export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { fetchBonusStatusFromAppsScript } from "@/lib/bonos/apps-script";
import { tokenPreview } from "@/lib/bonos/types";

/**
 * GET /api/bonos/token?token=XXXXX
 * Consulta el estado real en Google Apps Script (bonus-status).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = (searchParams.get("token") || "").trim();

    if (!token) {
      return NextResponse.json({
        success: false,
        status: "invalid",
        error: "Falta el token",
      });
    }

    console.log("[bono] Consulta de estado recibida", {
      token: tokenPreview(token),
    });

    const result = await fetchBonusStatusFromAppsScript(token);

    if (!result.ok) {
      console.error("[bono] Fallo al consultar estado:", result.error);
      return NextResponse.json(
        {
          success: false,
          status: result.status || "invalid",
          error: result.error,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      status: result.status,
    });
  } catch (error) {
    console.error("[bono] Error al validar token:", (error as Error).message);
    return NextResponse.json(
      { success: false, status: "invalid", error: "Error del servidor" },
      { status: 500 }
    );
  }
}
