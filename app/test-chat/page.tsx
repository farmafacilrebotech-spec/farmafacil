"use client";

import { useState } from "react";

type ChatItem = {
  role: "cliente" | "asistente";
  text: string;
};

// TODO: Reemplazar por IDs reales de sesión/autenticación.
const FARMACIA_ID = "89437d90-05aa-49b8-9d90-981050be0c51";
const CLIENTE_ID = "CLI001";
const NOMBRE_FARMACIA = "Farmacia Demo";

export default function TestChatPage() {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<ChatItem[]>([]);

  const enviarMensaje = async () => {
    const texto = mensaje.trim();
    if (!texto || loading) return;

    setError(null);
    setMensajes((prev) => [...prev, { role: "cliente", text: texto }]);
    setMensaje("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje: texto,
          farmacia_id: FARMACIA_ID,
          cliente_id: CLIENTE_ID,
          nombre_farmacia: NOMBRE_FARMACIA,
          conversacion_id: conversacionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error enviando mensaje");

      if (data?.conversacion_id) {
        setConversacionId(data.conversacion_id);
      }

      setMensajes((prev) => [
        ...prev,
        { role: "asistente", text: data?.respuesta || "Sin respuesta" },
      ]);
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Test Chat Cliente</h1>

      <div className="mb-4 rounded border p-3 text-sm text-gray-700">
        <p>
          <strong>farmacia_id:</strong> {FARMACIA_ID}
        </p>
        <p>
          <strong>cliente_id:</strong> {CLIENTE_ID}
        </p>
        <p>
          <strong>conversacion_id:</strong> {conversacionId || "nueva conversación"}
        </p>
      </div>

      <div className="mb-4 h-80 overflow-y-auto rounded border p-3">
        {mensajes.length === 0 ? (
          <p className="text-sm text-gray-500">Todavía no hay mensajes.</p>
        ) : (
          <ul className="space-y-2">
            {mensajes.map((item, idx) => (
              <li key={idx} className="text-sm">
                <strong>{item.role === "cliente" ? "Cliente" : "Asistente"}:</strong>{" "}
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <input
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void enviarMensaje();
            }
          }}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded border px-3 py-2 text-sm"
          disabled={loading}
        />
        <button
          onClick={() => void enviarMensaje()}
          disabled={loading || !mensaje.trim()}
          className="rounded bg-[#1ABBB3] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </main>
  );
}
