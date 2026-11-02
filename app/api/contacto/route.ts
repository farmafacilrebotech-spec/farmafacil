export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendContactEmails, type ContactLeadPayload } from "@/lib/contacto/email";

function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();

    const payload: ContactLeadPayload = {
      nombre: asString(raw.nombre),
      farmacia: asString(raw.farmacia),
      email: asString(raw.email),
      telefono: asString(raw.telefono),
      tipoUsuario: asString(raw.tipoUsuario),
      mensaje: asString(raw.mensaje),
      infoFarmacia: asString(raw.infoFarmacia),
      interes: asString(raw.interes),
      source: asString(raw.source) || "contacto",
      submittedAt: asString(raw.submittedAt) || new Date().toISOString(),
    };

    if (!payload.nombre || !payload.email || !payload.mensaje) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { success: false, error: "Email no válido" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Falta NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL en entorno");
      return NextResponse.json(
        { success: false, error: "Config error: falta webhook de contacto" },
        { status: 500 }
      );
    }

    const sheetResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const rawText = await sheetResponse.text();

    if (!sheetResponse.ok) {
      console.error("Apps Script devolvió error:", sheetResponse.status);
      return NextResponse.json(
        { success: false, error: "Apps Script error" },
        { status: 500 }
      );
    }

    let sheetResult: unknown = {};
    try {
      sheetResult = JSON.parse(rawText);
    } catch {
      sheetResult = { raw: "ok" };
    }

    // Emails vía Resend (aviso interno + confirmación). No registrar PII en logs.
    const emailResult = await sendContactEmails(payload);
    if (!emailResult.configured) {
      console.warn(
        "Contacto: Resend no configurado completamente.",
        emailResult.missing.join(", ")
      );
    } else {
      if (!emailResult.admin.ok && !emailResult.admin.skipped) {
        console.error("Contacto: fallo aviso interno Resend", emailResult.admin.status || "");
      }
      if (!emailResult.confirmation.ok && !emailResult.confirmation.skipped) {
        console.error(
          "Contacto: fallo confirmación Resend",
          emailResult.confirmation.status || ""
        );
      }
    }

    return NextResponse.json({
      success: true,
      result: sheetResult,
      email: {
        configured: emailResult.configured,
        adminSent: Boolean(emailResult.admin.ok),
        confirmationSent: Boolean(emailResult.confirmation.ok),
      },
    });
  } catch (error) {
    console.error("Error en /api/contacto");
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
