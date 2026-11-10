import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  FLYER_QR_URL,
  buildCommercialHref,
  classifyLead,
  presetFromQuery,
  publicAnalyticsFields,
  sanitizedCommercialSearch,
} from "./comercial.ts";
import { buildInternalNoticeEmail, buildConfirmationEmail } from "./email.ts";
import {
  buildCommercialLeadPayload,
  buildGeneralContactPayload,
  normalizeContactRequest,
  type CommercialLeadInput,
} from "./payload.ts";
import { processContactSubmission } from "./process.ts";
import type { ContactLeadPayload } from "./types.ts";

const baseCommercial: Omit<CommercialLeadInput, "interes"> = {
  nombre: "Ana López",
  farmacia: "Farmacia Centro",
  email: "ana@farmacia.test",
  telefono: "+34600111222",
  mensaje: "Queremos reducir las colas del mediodía.",
  consentimientoPromocional: false,
  aceptaInformacion: true,
  campana: {
    origen: "qr",
    medio: "impreso",
    campana: "lanzamiento-2027",
    pieza: "flyer",
  },
  source: "solicitar" as const,
};

function commercialRaw(
  interes: "piloto" | "implantar" | "demo" | "planes" | "otra",
  extra: Record<string, unknown> = {}
) {
  return {
    ...buildCommercialLeadPayload({ ...baseCommercial, interes }),
    submittedAt: "2026-11-05T21:00:00.000Z",
    ...extra,
  };
}

describe("procedencia y compatibilidad", () => {
  it("mantiene el ancla antigua y preselecciona el piloto", () => {
    const preset = presetFromQuery(new URLSearchParams("interes=prueba"));
    assert.equal(preset.interes, "piloto");
  });

  it("interpreta plan=kiosko como información de planes", () => {
    const preset = presetFromQuery(
      new URLSearchParams("plan=kiosko&origen=web&medio=boton&pieza=kiosko")
    );
    assert.equal(preset.interes, "planes");
    assert.equal(preset.campana.pieza, "kiosko");
  });

  it("plan=asistente-ia preselecciona la información de planes", () => {
    const preset = presetFromQuery(new URLSearchParams("plan=asistente-ia"));
    assert.equal(preset.interes, "planes");
  });

  it("descarta el parámetro antiguo de necesidades", () => {
    const clean = sanitizedCommercialSearch(
      new URLSearchParams("interes=planes&necesidades=kiosko,pedidos&plan=kiosko&origen=web")
    );
    assert.equal(clean, "interes=planes&plan=kiosko&origen=web");
    assert.equal(clean.includes("necesidades"), false);
  });

  it("un interés explícito gana al plan y no mezcla datos personales en la query", () => {
    const dirty = new URLSearchParams(
      "interes=implantar&plan=kiosko&email=ana@farmacia.test&nombre=Ana&origen=qr&campana=lanzamiento-2027"
    );
    const clean = sanitizedCommercialSearch(dirty);
    assert.equal(
      clean,
      "interes=implantar&plan=kiosko&origen=qr&campana=lanzamiento-2027"
    );
    assert.equal(clean.includes("@"), false);
    assert.equal(clean.includes("Ana"), false);
  });

  it("la URL del flyer es estable y abre implantación", () => {
    assert.equal(
      FLYER_QR_URL,
      "https://www.farmafacil.solutions/solicitar?interes=implantar&origen=qr&medio=impreso&campana=lanzamiento-2027&pieza=flyer"
    );
    const url = new URL(FLYER_QR_URL);
    const preset = presetFromQuery(url.searchParams);
    assert.equal(url.pathname, "/solicitar");
    assert.equal(preset.interes, "implantar");
    assert.equal(preset.campana.origen, "qr");
    assert.equal(preset.campana.campana, "lanzamiento-2027");
    assert.equal(preset.campana.pieza, "flyer");
  });

  it("los CTA no llevan datos de contacto", () => {
    const href = buildCommercialHref({
      interes: "piloto",
      origen: "web",
      medio: "boton",
      pieza: "hero",
    });
    assert.equal(href, "/solicitar?interes=piloto&origen=web&medio=boton&pieza=hero");
    assert.equal(href.includes("@"), false);
  });

  it("la analítica se queda con la ruta, sin query", () => {
    const fields = publicAnalyticsFields(
      new URL(`${FLYER_QR_URL}&email=ana@farmacia.test`)
    );
    assert.equal(fields.page_path, "/solicitar");
    assert.equal(fields.page_location, "https://www.farmafacil.solutions/solicitar");
    const layout = readFileSync(new URL("../../app/layout.tsx", import.meta.url), "utf8");
    assert.match(layout, /page_location: window\.location\.origin \+ window\.location\.pathname/);
  });
});

describe("clasificación y avisos", () => {
  it("destaca la implantación como alta intención", () => {
    const normalized = normalizeContactRequest(commercialRaw("implantar"));
    assert.equal(normalized.ok, true);
    if (!normalized.ok) return;
    assert.equal(normalized.payload.altaIntencion, true);
    assert.equal(normalized.payload.interes, "implantar");
    assert.equal(normalized.payload.consentimientoPromocional, false);

    const email = buildInternalNoticeEmail(normalized.payload);
    assert.equal(email.subject, "Alta intención · Implantación | FarmaFácil");
    assert.match(email.html, /Alta intención · Implantación/);
    assert.match(email.text, /Alta intención · Implantación/);
    assert.match(email.html, /Farmacia Centro/);
    assert.match(email.html, /ana@farmacia\.test/);
    assert.doesNotMatch(email.text, /Necesidades|Superficie|—/);
    assert.doesNotMatch(email.html, /Necesidades|Superficie|width:38%/);
    assert.match(email.text, /Mensaje: Queremos reducir las colas del mediodía\./);
    assert.match(email.text, /Origen: qr/);
    assert.match(email.text, /Campaña: lanzamiento-2027/);
    assert.match(email.text, /Consentimiento promocional: No/);
    assert.equal(normalized.payload.origen, "qr");
    assert.equal(normalized.payload.source, "solicitar");
  });

  it("clasifica piloto, demostración, planes y otra consulta por separado", () => {
    const subjects = {
      piloto: "Nueva solicitud de piloto | FarmaFácil",
      demo: "Nueva solicitud de demostración | FarmaFácil",
      planes: "Nueva solicitud de información | FarmaFácil",
      otra: "Nueva consulta comercial | FarmaFácil",
    } as const;
    for (const [interes, subject] of Object.entries(subjects)) {
      const normalized = normalizeContactRequest(
        commercialRaw(interes as keyof typeof subjects, {
          mensaje: "",
          consentimientoPromocional: true,
        })
      );
      assert.equal(normalized.ok, true);
      if (!normalized.ok) return;
      assert.equal(normalized.payload.altaIntencion, false);
      assert.equal(normalized.payload.mensajeEsAutomatico, true);
      assert.equal(normalized.payload.consentimientoPromocional, true);
      const email = buildInternalNoticeEmail(normalized.payload);
      assert.equal(email.subject, subject);
      assert.match(email.text, /Consentimiento promocional: Sí/);
      assert.match(email.html, /Consentimiento promocional/);
      assert.doesNotMatch(email.text, /Mensaje:|Necesidades|Superficie|—|Alta intención · Implantación/);
      assert.doesNotMatch(email.html, /Necesidades|Superficie|width:38%/);
    }
  });

  it("el contacto general no se convierte en prueba aunque el mensaje la mencione", () => {
    const raw = {
      ...buildGeneralContactPayload({
        nombre: "Luis",
        farmacia: "",
        email: "luis@cliente.test",
        telefono: "",
        tipoUsuario: "cliente",
        mensaje: "Quiero información sobre la prueba piloto, sin ser farmacia.",
        infoFarmacia: "esto no debe viajar",
      }),
      submittedAt: "2026-11-05T21:00:00.000Z",
      consentimientoPromocional: true,
      interes: "prueba_piloto",
    };
    const normalized = normalizeContactRequest(raw);
    assert.equal(normalized.ok, true);
    if (!normalized.ok) return;
    assert.equal(normalized.payload.formulario, "contacto");
    assert.equal(normalized.payload.interes, "contacto_general");
    assert.equal(normalized.payload.consentimientoPromocional, false);
    assert.equal(normalized.payload.infoFarmacia, "");
    assert.equal(classifyLead(normalized.payload).kind, "contacto");

    const email = buildInternalNoticeEmail(normalized.payload);
    assert.equal(email.subject, "Nuevo contacto | FarmaFácil");
    assert.match(email.text, /prueba piloto/);
    assert.doesNotMatch(email.subject, /prueba|piloto|Implantación/i);
    assert.doesNotMatch(email.text, /Consentimiento promocional/);

    const confirmation = buildConfirmationEmail(normalized.payload);
    assert.equal(confirmation.subject, "Hemos recibido tu mensaje | FarmaFácil");
    assert.doesNotMatch(confirmation.text, /promocional|suscrit/i);
    assert.doesNotMatch(confirmation.html, /promocional|suscrit/i);
  });

  it("un string true no marca el consentimiento promocional", () => {
    const normalized = normalizeContactRequest(
      commercialRaw("piloto", { consentimientoPromocional: "true" })
    );
    assert.equal(normalized.ok, true);
    if (!normalized.ok) return;
    assert.equal(normalized.payload.consentimientoPromocional, false);
  });

  it("rechaza la solicitud comercial nueva sin la información de privacidad", () => {
    const normalized = normalizeContactRequest(
      commercialRaw("implantar", { aceptaInformacion: false })
    );
    assert.equal(normalized.ok, false);
    if (normalized.ok) return;
    assert.equal(normalized.status, 400);
  });

  it("sigue aceptando el POST antiguo de la landing", () => {
    const normalized = normalizeContactRequest({
      nombre: "Marta",
      email: "marta@farmacia.test",
      telefono: "+34600999888",
      farmacia: "Farmacia Sol",
      tipoUsuario: "farmacia",
      mensaje: "Solicitud de prueba piloto (landing)",
      infoFarmacia: "Estamos en el centro",
      interes: "prueba_piloto",
      source: "landing",
    });
    assert.equal(normalized.ok, true);
    if (!normalized.ok) return;
    assert.equal(normalized.payload.interes, "piloto");
    assert.equal(normalized.payload.formulario, "comercial");
    assert.equal(buildInternalNoticeEmail(normalized.payload).subject, "Nueva solicitud de piloto | FarmaFácil");
  });

  it("ignora una lista antigua de necesidades y no la pone en el correo", () => {
    const normalized = normalizeContactRequest(
      commercialRaw("demo", { necesidades: ["kiosko", "pedidos"] })
    );
    assert.equal(normalized.ok, true);
    if (!normalized.ok) return;
    assert.equal("necesidades" in normalized.payload, false);
    const email = buildInternalNoticeEmail(normalized.payload);
    assert.equal(email.subject, "Nueva solicitud de demostración | FarmaFácil");
    assert.doesNotMatch(email.text, /Necesidades|kiosko|Superficie/);
    assert.doesNotMatch(email.html, /Necesidades|Superficie/);
  });

  it("muestra solo la procedencia con valor y no vacía el payload", () => {
    const normalized = normalizeContactRequest(
      commercialRaw("piloto", {
        mensaje: "   ",
        origen: "web",
        medio: "",
        campana: "",
        pieza: "",
      })
    );
    assert.equal(normalized.ok, true);
    if (!normalized.ok) return;
    assert.equal(normalized.payload.origen, "web");
    assert.equal(normalized.payload.medio, "");
    assert.equal(normalized.payload.campana, "");
    assert.equal(normalized.payload.pieza, "");
    assert.equal(normalized.payload.source, "solicitar");
    assert.equal(normalized.payload.mensajeEsAutomatico, true);
    const email = buildInternalNoticeEmail(normalized.payload);
    assert.equal(email.subject, "Nueva solicitud de piloto | FarmaFácil");
    assert.match(email.text, /Origen: web/);
    assert.match(email.text, /Consentimiento promocional: No/);
    assert.match(email.text, /Fecha:/);
    assert.doesNotMatch(email.text, /Medio:|Campaña:|Pieza:|Mensaje:|Superficie:|—/);
    assert.doesNotMatch(email.html, /Medio|Campaña|Pieza|Superficie|—/);
    assert.doesNotMatch(email.html, /Alta intención · Implantación/);
  });
});

describe("envío de los dos formularios", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = {
    webhook: process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL,
    resend: process.env.RESEND_API_KEY,
    admin: process.env.CONTACT_ADMIN_EMAIL,
  };

  type SheetBehavior =
    | { kind: "json"; status: number; body: unknown }
    | { kind: "text"; status: number; body: string }
    | { kind: "throw" };

  async function capture(raw: unknown, sheet?: SheetBehavior) {
    const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
    const logs: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      logs.push(args.map((item) => String(item)).join(" "));
    };
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL = "https://sheets.test/exec";
    process.env.RESEND_API_KEY = "re_test_local";
    process.env.CONTACT_ADMIN_EMAIL = "interno@farmafacil.solutions";
    globalThis.fetch = async (input, init) => {
      const url = String(input);
      const body = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {};
      calls.push({ url, body });
      if (url === "https://sheets.test/exec" && sheet?.kind === "throw") {
        throw new Error("network ana@farmacia.test detalle interno");
      }
      if (url === "https://sheets.test/exec" && sheet?.kind === "text") {
        return new Response(sheet.body, { status: sheet.status });
      }
      if (url === "https://sheets.test/exec" && sheet?.kind === "json") {
        return new Response(JSON.stringify(sheet.body), { status: sheet.status });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };
    try {
      const result = await processContactSubmission(raw);
      return { result, calls, logs };
    } finally {
      console.error = originalError;
    }
  }

  function correos(calls: Array<{ url: string }>) {
    return calls.filter((call) => call.url === "https://api.resend.com/emails");
  }

  it("envía la solicitud comercial a la hoja y clasifica el aviso interno", async () => {
    try {
      const { result, calls } = await capture(commercialRaw("implantar"));
      assert.equal(result.status, 200);
      assert.equal(result.body.success, true);

      const sheet = calls.find((call) => call.url === "https://sheets.test/exec");
      assert.ok(sheet);
      assert.equal(sheet.body.interes, "implantar");
      assert.equal(sheet.body.nivel_interes, "implantar");
      assert.equal(sheet.body.altaIntencion, true);
      assert.equal(sheet.body.campana, "lanzamiento-2027");
      assert.equal(sheet.body.origen, "qr");
      assert.equal(sheet.body.consentimientoPromocional, false);
      assert.equal("necesidades" in sheet.body, false);
      assert.equal(sheet.url.includes("ana@farmacia.test"), false);

      const admin = calls.find(
        (call) =>
          call.url === "https://api.resend.com/emails" &&
          Array.isArray(call.body.to) &&
          call.body.to[0] === "interno@farmafacil.solutions"
      );
      assert.ok(admin);
      assert.equal(admin.body.subject, "Alta intención · Implantación | FarmaFácil");
      assert.match(String(admin.body.text), /Consentimiento promocional: No/);
      assert.match(String(admin.body.html), /Alta intención · Implantación/);
      assert.doesNotMatch(String(admin.body.text), /Necesidades|Superficie/);
      assert.doesNotMatch(String(admin.body.html), /width:38%/);

      const confirmation = calls.find(
        (call) =>
          call.url === "https://api.resend.com/emails" &&
          Array.isArray(call.body.to) &&
          call.body.to[0] === "ana@farmacia.test"
      );
      assert.ok(confirmation);
      assert.equal(confirmation.body.subject, "Hemos recibido tu mensaje | FarmaFácil");
      assert.doesNotMatch(String(confirmation.body.text), /promocional/i);
    } finally {
      globalThis.fetch = originalFetch;
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL = originalEnv.webhook;
      process.env.RESEND_API_KEY = originalEnv.resend;
      process.env.CONTACT_ADMIN_EMAIL = originalEnv.admin;
    }
  });

  it("mantiene el aviso de contacto aunque el mensaje hable de una prueba", async () => {
    try {
      const { result, calls } = await capture({
        ...buildGeneralContactPayload({
          nombre: "Luis",
          farmacia: "Farmacia Norte",
          email: "luis@farmacia.test",
          telefono: "+34600111000",
          tipoUsuario: "farmacia",
          mensaje: "Me interesa la prueba piloto, escribo desde contacto.",
          infoFarmacia: "Dos empleados en mostrador",
        }),
        submittedAt: "2026-11-05T21:00:00.000Z",
      });
      assert.equal(result.status, 200);
      const admin = calls.find(
        (call) =>
          call.url === "https://api.resend.com/emails" &&
          Array.isArray(call.body.to) &&
          call.body.to[0] === "interno@farmafacil.solutions"
      );
      assert.ok(admin);
      assert.equal(admin.body.subject, "Nuevo contacto | FarmaFácil");
      assert.match(String(admin.body.text), /Dos empleados en mostrador/);
      assert.doesNotMatch(String(admin.body.subject), /piloto|Implantación/);

      const sheet = calls.find((call) => call.url === "https://sheets.test/exec");
      assert.equal((sheet?.body as ContactLeadPayload).formulario, "contacto");
      assert.equal((sheet?.body as ContactLeadPayload).nivel_interes, "contacto_general");
      assert.equal((sheet?.body as ContactLeadPayload).consentimientoPromocional, false);
    } finally {
      globalThis.fetch = originalFetch;
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL = originalEnv.webhook;
      process.env.RESEND_API_KEY = originalEnv.resend;
      process.env.CONTACT_ADMIN_EMAIL = originalEnv.admin;
    }
  });

  it("no confirma ni envía correos si la hoja responde 200 con success false", async () => {
    try {
      const { result, calls, logs } = await capture(commercialRaw("implantar"), {
        kind: "json",
        status: 200,
        body: { success: false, error: "fallo interno ana@farmacia.test" },
      });
      assert.equal(result.status, 502);
      assert.equal(result.body.success, false);
      assert.match(String(result.body.error), /inténtalo de nuevo/i);
      assert.equal(String(result.body.error).includes("@"), false);
      assert.equal(correos(calls).length, 0);
      assert.equal(calls.filter((call) => call.url === "https://sheets.test/exec").length, 1);
      assert.equal(logs.join(" ").includes("@"), false);
      assert.equal(logs.join(" ").includes("fallo interno"), false);
    } finally {
      globalThis.fetch = originalFetch;
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL = originalEnv.webhook;
      process.env.RESEND_API_KEY = originalEnv.resend;
      process.env.CONTACT_ADMIN_EMAIL = originalEnv.admin;
    }
  });

  it("no confirma ni envía correos si el registro responde con HTTP de error", async () => {
    try {
      const { result, calls, logs } = await capture(commercialRaw("demo"), {
        kind: "json",
        status: 500,
        body: { success: false, error: "detalle ana@farmacia.test" },
      });
      assert.equal(result.status, 502);
      assert.equal(result.body.success, false);
      assert.match(String(result.body.error), /inténtalo de nuevo/i);
      assert.equal(correos(calls).length, 0);
      assert.equal(logs.join(" ").includes("@"), false);
    } finally {
      globalThis.fetch = originalFetch;
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL = originalEnv.webhook;
      process.env.RESEND_API_KEY = originalEnv.resend;
      process.env.CONTACT_ADMIN_EMAIL = originalEnv.admin;
    }
  });

  it("no confirma ni envía correos si no hay conexión con el registro", async () => {
    try {
      const { result, calls, logs } = await capture(commercialRaw("piloto"), { kind: "throw" });
      assert.equal(result.status, 502);
      assert.equal(result.body.success, false);
      assert.match(String(result.body.error), /inténtalo de nuevo/i);
      assert.equal(correos(calls).length, 0);
      assert.equal(calls.filter((call) => call.url === "https://sheets.test/exec").length, 1);
      assert.equal(logs.join(" ").includes("ana@farmacia.test"), false);
      assert.equal(logs.join(" ").includes("detalle interno"), false);
    } finally {
      globalThis.fetch = originalFetch;
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL = originalEnv.webhook;
      process.env.RESEND_API_KEY = originalEnv.resend;
      process.env.CONTACT_ADMIN_EMAIL = originalEnv.admin;
    }
  });

  it("no acepta una respuesta 200 que no confirma success true", async () => {
    try {
      const html = await capture(commercialRaw("planes"), {
        kind: "text",
        status: 200,
        body: "<html>ana@farmacia.test</html>",
      });
      assert.equal(html.result.body.success, false);
      assert.equal(correos(html.calls).length, 0);
      assert.equal(html.logs.join(" ").includes("@"), false);

      const textTrue = await capture(commercialRaw("otra"), {
        kind: "json",
        status: 200,
        body: { success: "true" },
      });
      assert.equal(textTrue.result.body.success, false);
      assert.equal(correos(textTrue.calls).length, 0);
    } finally {
      globalThis.fetch = originalFetch;
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL = originalEnv.webhook;
      process.env.RESEND_API_KEY = originalEnv.resend;
      process.env.CONTACT_ADMIN_EMAIL = originalEnv.admin;
    }
  });
});
