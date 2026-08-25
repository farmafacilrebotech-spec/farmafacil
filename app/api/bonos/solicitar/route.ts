export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { claimBonusViaAppsScript } from "@/lib/bonos/apps-script";
import {
  tokenPreview,
  type SolicitarBonoPayload,
} from "@/lib/bonos/types";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPostalCode(value: string): boolean {
  return /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(value.replace(/\D/g, ""));
}

/**
 * POST /api/bonos/solicitar
 * Reenvía la solicitud a Google Apps Script (action=bonus-claim).
 * Solo confirma éxito si Apps Script responde success:true y status:"claimed"
 * (o already_claimed si ya estaba registrada).
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SolicitarBonoPayload> & {
      confirmaDatos?: boolean;
    };

    const token = typeof body.token === "string" ? body.token.trim() : "";
    console.log("[bono] Solicitud recibida");
    console.log("[bono] Token:", tokenPreview(token) || "(vacío)");

    if (!token) {
      return NextResponse.json(
        { success: false, status: "invalid", error: "Falta el token" },
        { status: 400 }
      );
    }

    const nombre = (body.nombre || "").trim();
    const farmacia = (body.farmacia || "").trim();
    const direccion = (body.direccion || "").trim();
    const codigoPostal = (body.codigoPostal || "").replace(/\D/g, "").slice(0, 5);
    const municipio = (body.municipio || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const whatsapp = (body.whatsapp || "").trim();
    const confirmacionFarmacia = Boolean(
      body.confirmacionFarmacia ?? body.confirmaDatos
    );
    const consentimientoComercial = Boolean(body.consentimientoComercial);

    const errors: Record<string, string> = {};
    if (nombre.length < 2) errors.nombre = "Indica tu nombre y apellidos.";
    if (farmacia.length < 2) errors.farmacia = "Indica el nombre de la farmacia.";
    if (direccion.length < 3) {
      errors.direccion = "Indica la dirección de la farmacia.";
    }
    if (!isValidPostalCode(codigoPostal)) {
      errors.codigoPostal = "Indica un código postal español válido.";
    }
    if (municipio.length < 2) errors.municipio = "Indica el municipio.";
    if (!isValidEmail(email)) errors.email = "Indica un email válido.";
    if (whatsapp.replace(/\D/g, "").length < 9) {
      errors.whatsapp = "Indica un número de WhatsApp válido.";
    }
    if (!confirmacionFarmacia) {
      errors.confirmaDatos =
        "Debes confirmar que los datos corresponden a la farmacia participante.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos", errors },
        { status: 400 }
      );
    }

    const result = await claimBonusViaAppsScript({
      token,
      nombre,
      farmacia,
      direccion,
      codigoPostal,
      municipio,
      email,
      whatsapp,
      confirmacionFarmacia,
      consentimientoComercial,
    });

    if (result.ok) {
      if (result.status === "claimed") {
        return NextResponse.json({
          success: true,
          status: "claimed",
        });
      }
      return NextResponse.json({
        success: true,
        status: "already_claimed",
      });
    }

    // Cualquier otro caso: no éxito de UI
    const status = result.status;
    if (status === "expired") {
      return NextResponse.json(
        { success: false, status: "expired", error: result.error },
        { status: 410 }
      );
    }
    if (status === "invalid") {
      return NextResponse.json(
        { success: false, status: "invalid", error: result.error },
        { status: 400 }
      );
    }
    if (status === "already_claimed") {
      return NextResponse.json(
        { success: false, status: "already_claimed", error: result.error },
        { status: 409 }
      );
    }

    console.error("[bono] Apps Script no confirmó el registro:", result.error);
    return NextResponse.json(
      {
        success: false,
        status: status || undefined,
        error: result.error,
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("[bono] Error en /api/bonos/solicitar:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
