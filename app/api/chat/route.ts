import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ChatBody = {
  mensaje?: unknown;
  cliente_id?: unknown;
  farmacia_id?: unknown;
  conversacion_id?: unknown;
  nombre_farmacia?: unknown;
};

function detectarEscalado(mensaje: string) {
  const texto = mensaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const triggers = [
    "farmaceutico",
    "hablar con alguien",
    "persona",
    "urgente",
    "embarazo",
    "embarazada",
    "medicacion",
    "receta",
    "dolor fuerte",
  ];

  return triggers.some((t) => texto.includes(t));
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatBody;

    const mensaje = asString(body.mensaje);
    const cliente_id = asString(body.cliente_id) || null;
    const farmacia_id = asString(body.farmacia_id) || null;
    const conversacion_id = asString(body.conversacion_id) || null;
    const nombreFarmacia = asString(body.nombre_farmacia) || "tu farmacia";

    if (!mensaje || mensaje.length > 2000) {
      return NextResponse.json(
        { error: "Mensaje inválido" },
        { status: 400 }
      );
    }

    // =========================
    // 1. CREAR CONVERSACIÓN SI NO EXISTE
    // =========================

    let convId = conversacion_id;

    if (!convId) {
      if (!farmacia_id) {
        return NextResponse.json(
          { error: "farmacia_id es obligatorio para iniciar conversación" },
          { status: 400 }
        );
      }

      const { data: nuevaConv, error } = await supabase
        .from("conversaciones")
        .insert({
          cliente_id,
          farmacia_id,
          estado: "abierta",
        })
        .select()
        .single();

      if (error) throw error;
      if (!nuevaConv?.id) throw new Error("No se pudo crear la conversación");

      convId = nuevaConv.id;
    }

    // =========================
    // 2. GUARDAR MENSAJE CLIENTE
    // =========================

    const { error: errorMensajeCliente } = await supabase.from("mensajes").insert({
      conversacion_id: convId,
      emisor: "cliente",
      mensaje,
    });
    if (errorMensajeCliente) throw errorMensajeCliente;

    // =========================
    // 3. DECISIÓN: ESCALAR O IA
    // =========================

    const escalar = detectarEscalado(mensaje);

    if (escalar) {
      // actualizar estado conversación
      const { error: errorEstado } = await supabase
        .from("conversaciones")
        .update({ estado: "derivada" })
        .eq("id", convId);
      if (errorEstado) throw errorEstado;

      const respuesta =
        "Perfecto, voy a pasar tu consulta al farmacéutico. En cuanto la revise, te responderá por aquí.";

      const { error: errorMensajeAsistente } = await supabase.from("mensajes").insert({
        conversacion_id: convId,
        emisor: "asistente",
        mensaje: respuesta,
      });
      if (errorMensajeAsistente) throw errorMensajeAsistente;

      return NextResponse.json({
        respuesta,
        derivado: true,
        conversacion_id: convId,
      });
    }

    // =========================
    // 4. LLAMADA A OPENAI
    // =========================

    const promptSistema = `
Eres FarmaFácil, el asistente de la farmacia ${nombreFarmacia}.

Tu función:
- Ayudar al cliente
- Responder de forma clara y breve
- No dar diagnósticos médicos
- Recomendar productos de forma general
- Si hay riesgo, sugerir hablar con farmacéutico
- Nunca sustituir al farmacéutico real

Sé cercano, profesional y útil.
Presentación de referencia: "Hola, soy FarmaFacil, el asistente de tu farmacia ${nombreFarmacia}. ¿En qué puedo ayudarte?"
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: promptSistema },
        { role: "user", content: mensaje },
      ],
    });

    const respuesta =
      completion.choices[0]?.message?.content ||
      "Lo siento, ha habido un problema.";

    // =========================
    // 5. GUARDAR RESPUESTA IA
    // =========================

    const { error: errorMensajeIA } = await supabase.from("mensajes").insert({
      conversacion_id: convId,
      emisor: "asistente",
      mensaje: respuesta,
    });
    if (errorMensajeIA) throw errorMensajeIA;

    // =========================
    // 6. RESPUESTA FINAL
    // =========================

    return NextResponse.json({
      respuesta,
      derivado: false,
      conversacion_id: convId,
    });
  } catch (error: any) {
    console.error("ERROR CHAT:", error);

    return NextResponse.json(
      { error: error?.message || "Error en el chat" },
      { status: 500 }
    );
  }
}